import { queryClient } from "@/lib/queryClient";

export const eventKeysKey = ["eventKeys"] as const;

export interface EventKeys {
    detailKeys: string[];
    participantDetailKeys: string[];
}

export function setEventKeys(data: EventKeys | null) {
    queryClient.setQueryData<EventKeys | null>(eventKeysKey, data);
}

export function getEventKeys(): EventKeys | null {
    return queryClient.getQueryData<EventKeys | null>(eventKeysKey) ?? null;
}
