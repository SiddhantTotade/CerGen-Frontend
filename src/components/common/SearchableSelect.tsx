import * as React from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { getEventKeys } from "@/api/app";
import { setEventKeys } from "@/state/selectedTemplateKeys";

type GenericItem = Record<string, any>;

export function SearchableSelect({
  items,
  labelKey = "event",
  idKey = "id",
  shouldFetchKeys = true,
  onSelectItem, // 👈 new prop
}: {
  items: GenericItem[];
  labelKey?: string;
  idKey?: string;
  shouldFetchKeys?: boolean;
  onSelectItem?: (item: GenericItem) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string>("");

  const handleSelect = async (id: string) => {
    setSelected(id);
    setOpen(false);

    const item = items.find((i) => String(i[idKey]) === id);
    if (onSelectItem && item) onSelectItem(item); // ✅ send selected item up

    if (!shouldFetchKeys) return;

    try {
      const res = await getEventKeys(id);
      const { detailKeys, participantDetailKeys } = res;
      setEventKeys({ detailKeys, participantDetailKeys });
    } catch (err) {
      console.error("Failed to fetch event keys:", err);
    }
  };

  const selectedItem = items.find((i) => String(i[idKey]) === selected);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        id="custom_card"
        className="hover:text-white cursor-pointer"
        asChild
      >
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedItem ? selectedItem[labelKey] : "Select item..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0">
        <Command id="custom_card" className="text-white">
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No matches found.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item[idKey]}
                  value={String(item[labelKey])}
                  onSelect={() => handleSelect(String(item[idKey]))}
                  className="text-white cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected === String(item[idKey])
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {item[labelKey]}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
