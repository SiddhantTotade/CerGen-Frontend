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

interface SearchableSelectProps {
  items?: GenericItem[];
  labelKey?: string;
  idKey?: string;
  shouldFetchKeys?: boolean;
  value?: string;
  label?: string
  onSelectItem?: (item: GenericItem) => void;
}

export function SearchableSelect({
  items = [],
  labelKey = "event",
  idKey = "id",
  shouldFetchKeys = true,
  value,
  label,
  onSelectItem,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [internalSelected, setInternalSelected] = React.useState<string>("");

  const isControlled = value !== undefined;
  const selectedValue = isControlled ? value : internalSelected;

  React.useEffect(() => {
    if (isControlled) {
      setInternalSelected(value || "");
    }
  }, [value, isControlled]);

  const handleSelect = async (id: string) => {
    if (!Array.isArray(items) || items.length === 0) return;
    const item = items.find((i) => String(i[idKey]) === id);
    if (!item) return;

    if (!isControlled) setInternalSelected(id);
    setOpen(false);

    if (onSelectItem) onSelectItem(item);

    if (!shouldFetchKeys || !id) return;

    try {
      const res = await getEventKeys(id);
      const { detailKeys, participantDetailKeys } = res;
      setEventKeys({ detailKeys, participantDetailKeys });
    } catch (err) {
      console.error("Failed to fetch event keys:", err);
    }
  };

  const selectedItem =
    Array.isArray(items) && items.length > 0
      ? items.find((i) => String(i[idKey]) === selectedValue)
      : null;

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
          className="w-full justify-between text-white hover:text-white"
        >
          {selectedItem ? selectedItem[labelKey] : label}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0">
        <Command id="custom_card" className="text-white">
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No matches found.</CommandEmpty>
            <CommandGroup>
              {Array.isArray(items) && items.length > 0 ? (
                items.map((item) => (
                  <CommandItem
                    key={item[idKey]}
                    value={String(item[labelKey])}
                    onSelect={() => handleSelect(String(item[idKey]))}
                    className="text-white cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedValue === String(item[idKey])
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {item[labelKey]}
                  </CommandItem>
                ))
              ) : (
                <CommandEmpty>No items available.</CommandEmpty>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
