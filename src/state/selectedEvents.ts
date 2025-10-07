import { queryClient } from "@/lib/queryClient";

export const selectedEventKey = ["selectedEvent"] as const;

export interface SelectedEvent {
  event: string;
  details: Record<string, string>;
}

export function setSelectedEvent(event: SelectedEvent | null) {
  queryClient.setQueryData<SelectedEvent | null>(selectedEventKey, event);
}

export function getSelectedEvent(): SelectedEvent | null {
  return queryClient.getQueryData<SelectedEvent | null>(selectedEventKey) ?? null;
}
