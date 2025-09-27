import { createEvent } from "@/api/app";
import { useMutation } from "@tanstack/react-query";
import type { EventRequest, EventResponse } from "@/api/app";

export const useEvents = () => {
  return useMutation<EventResponse, Error, EventRequest>({
    mutationFn: createEvent,
  });
};
