import { apiFetch } from "./client";

export interface EventRequest {
  id?: string
  event: string;
  details: Record<string, string>;
}

export interface EventResponse {
  id?: string
  event: string;
  details: Record<string, string>;
}

export interface ParticipantRequest {
  id?: string
  event: string
  participant_details: Record<string, string>
}

export interface ParticipantResponse {
  id?: string
  event: string
  participant_details: Record<string, string>
}

export const getEvents = (): Promise<EventResponse[]> => {
  return apiFetch("/app/api/event", {
    method: "GET",
  });
};

export const createEvent = (data: EventRequest): Promise<EventRequest> => {
  return apiFetch("/app/api/event/", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateEvent = (data: EventRequest): Promise<EventRequest> => {
  if (!data.id) throw new Error("Missing event id for update")

  return apiFetch("/app/api/event/", {
    method: "PUT",
    body: JSON.stringify(data)
  })
}

export const getParticipants = (eventId: string): Promise<ParticipantResponse[]> => {
  return apiFetch(`/app/api/participant?event=${eventId}`, {
    method: "GET",
  })
}