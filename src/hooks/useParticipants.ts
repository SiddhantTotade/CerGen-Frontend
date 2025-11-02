import { useMutation, useQuery, useQueryClient, } from "@tanstack/react-query";

import { createParticipant, getParticipants, updateParticipant } from "@/api/app";
import type { ParticipantRequest, ParticipantResponse } from "@/api/app";

export const useFetchParticipants = (eventId: string) => {
  return useQuery<ParticipantResponse[], Error>({
    queryKey: ["participants", eventId],
    queryFn: async ({ queryKey }) => {
      const [, eventId] = queryKey;
      const data = await getParticipants(eventId as string);

      return data.map((p: any) => ({
        ...p,
        participant_details: (() => {
          try {
            return JSON.parse(p.participantDetails || "{}");
          } catch {
            return {};
          }
        })(),
      }));
    },
    enabled: !!eventId,
    staleTime: 1000 * 60 * 5,
  });
};


export const useCreateParticipants = (eventId: string) => {
    const queryClient = useQueryClient()

    return useMutation<ParticipantResponse, Error, ParticipantRequest>({
        mutationFn: (payload) => createParticipant(eventId, payload),
        onSuccess: (newParticipant) => {
            queryClient.setQueryData<ParticipantResponse[]>(["participants"], (old = []) => [...old, newParticipant])
        }
    })
}

export const useUpdateParticipants = () => {
    const queryClient = useQueryClient()

    return useMutation<ParticipantResponse, Error, ParticipantRequest>({
        mutationFn: updateParticipant,
        onSuccess: (updatedParticipant) => {
            queryClient.setQueryData<ParticipantResponse[]>(["participant"], (old = []) =>
                old.map((p) => (p.id === updatedParticipant.id ? updatedParticipant : p)))
        }
    })
}