import { useQuery } from "@tanstack/react-query";
import {
  setSelectedEvent,
  getSelectedEvent,
  selectedEventKey,
  type SelectedEvent,
} from "@/state/selectedEvents";

export function useSelectedEvent() {
  const { data: selectedEvent = null } = useQuery<SelectedEvent | null>({
    queryKey: selectedEventKey,
    queryFn: getSelectedEvent,
    initialData: null,
  });

  return {
    selectedEvent,
    setSelectedEvent,
  };
}
