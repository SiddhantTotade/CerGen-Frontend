import { FormCard } from "@/components/common/FormCard";
import { useSelectedEvent } from "@/hooks/useSelectedEvent";

export function SelectedEventDetails() {
  const { selectedEvent } = useSelectedEvent();

  if (!selectedEvent) return <p>Hello</p>;

  let parsedDetails: Record<string, unknown> = {};

  try {
    parsedDetails = JSON.parse(String(selectedEvent.details));
  } catch (e) {
    console.error("Failed to parse details:", e);
  }

  return (
    <FormCard>
      <div>
        <h2 className="text-lg font-semibold">{selectedEvent.event}</h2>
        <ul className="mt-2 space-y-1">
          {Object.entries(parsedDetails).map(([key, value]) => (
            <li key={key} className="flex justify-between">
              <span className="font-medium">{key}</span>
              <span>{String(value)}</span>
            </li>
          ))}
        </ul>
      </div>
    </FormCard>
  );
}
