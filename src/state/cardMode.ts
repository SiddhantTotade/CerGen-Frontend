import { queryClient } from "@/lib/queryClient";

export type Mode =
  | "none"
  | "show event"
  | "create event"
  | "edit event"
  | "show participant"
  | "create participant"
  | "edit participant"
  | "create template"
  | "edit template";

export const cardModeKey = ["cardMode"] as const;

export function setCardMode(mode: Mode) {
  queryClient.setQueryData<Mode>(cardModeKey, mode);
}

export function getCardMode(): Mode {
  return queryClient.getQueryData<Mode>(cardModeKey) ?? "none";
}
