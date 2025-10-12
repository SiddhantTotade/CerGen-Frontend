import { FormCard } from "@/components/common/FormCard";
import { useSelectedEvent } from "@/hooks/useSelectedEvent";

export function SelectedEventDetails() {
  const { selectedEvent } = useSelectedEvent();

  if (!selectedEvent) return <p>Hello</p>;

  return (
    <FormCard>
      <div>
        <h2 className="text-lg font-semibold">{selectedEvent.event}</h2>
        <ul className="mt-2 space-y-1">
          {Object.entries(selectedEvent.details).map(([key, value]) => (
            <li key={key} className="flex justify-between">
              <span className="font-medium">{key}</span>
              <span>{value}</span>
            </li>
          ))}
        </ul>
      </div>
    </FormCard>
  );
}
