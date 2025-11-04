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

type Event = {
  id: string;
  event: string;
  details: Record<string, string>;
};

export function SearchableSelect({ events }: { events: Event[] }) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<string>("");

  const filteredEvents = events.filter((e) => {
    const searchLower = search.toLowerCase();
    return (
      e.event.toLowerCase().includes(searchLower) ||
      Object.values(e.details).join(" ").toLowerCase().includes(searchLower)
    );
  });

  const handleSelect = async (id: string) => {
    setSelected(id);
    setOpen(false);
    try {
      const res = await getEventKeys(id);

      const { detailKeys, participantDetailKeys } = res;

      setEventKeys({
        detailKeys,
        participantDetailKeys,
      });

    } catch (err) {
      console.error("Failed to fetch event keys:", err);
    }
  };


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selected
            ? events.find((e) => e.id === selected)?.event
            : "Select event..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Search event..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No event found.</CommandEmpty>
            <CommandGroup>
              {filteredEvents.map((event) => (
                <CommandItem
                  key={event.id}
                  value={event.id}
                  onSelect={() => handleSelect(event.id)}
                >
                  <Check
                    className={cn(
                      selected === event.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {event.event}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
