import { apiFetch } from "./client";

export interface EventRequest {
  event: string;
  details: string;
}

export interface EventResponse {
  event: string;
  details: string;
}

export const createEvent = (data: EventRequest): Promise<EventRequest> => {
  return apiFetch("/app/api/event/", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getEvents = ():Promise<EventResponse[]>=>{
  return apiFetch("/app/api/event",{
    method:"GET"
  })
}