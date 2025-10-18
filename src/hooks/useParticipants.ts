import { useQuery, } from "@tanstack/react-query";

import { getParticipants } from "@/api/app";
import type { ParticipantResponse } from "@/api/app";

export const useFetchParticipants = (eventId: string) => {
    return useQuery<ParticipantResponse[], Error>({
        queryKey: ["participants", eventId],
        queryFn: async ({ queryKey }) => {
            const [, eventId] = queryKey
            return getParticipants(eventId as string)
        },
        enabled: !!eventId,
        staleTime: 1000 * 60 * 5,
    });
};
