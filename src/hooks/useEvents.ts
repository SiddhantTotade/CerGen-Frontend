import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { getEvents, createEvent, updateEvent } from "@/api/app";
import type { EventRequest, EventResponse } from "@/api/app";

export const useFetchEvents = () => {
  return useQuery<EventResponse[], Error>({
    queryKey: ["events"],
    queryFn: getEvents,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation<EventResponse, Error, EventRequest>({
    mutationFn: createEvent,
    onSuccess: (newEvent) => {
      queryClient.setQueryData<EventResponse[]>(["events"], (old = []) => [
        ...old,
        newEvent,
      ]);
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation<EventResponse, Error, EventRequest>({
    mutationFn: updateEvent,
    onSuccess: (updatedEvent) => {
      queryClient.setQueryData<EventResponse[]>(["events"], (old = []) =>
        old.map((ev) => (ev.id === updatedEvent.id ? updatedEvent : ev))
      );
    },
  });
};
