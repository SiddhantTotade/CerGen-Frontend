import { queryClient } from "@/lib/queryClient";

export type Mode = "none" | "create" | "edit";

export const cardModeKey = ["cardMode"] as const;

export function setCardMode(mode: Mode) {
  queryClient.setQueryData<Mode>(cardModeKey, mode);
}

export function getCardMode(): Mode {
  return queryClient.getQueryData<Mode>(cardModeKey) ?? "none";
}
