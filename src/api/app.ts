import { apiFetch } from "./client";

export interface EventRequest {
  id?: string;
  event: string;
  details: Record<string, string>;
}

export interface EventResponse {
  id?: string;
  event: string;
  details: Record<string, string>;
}

export interface ParticipantRequest {
  id?: string;
  event: string;
  participant_details: Record<string, string>;
}

export interface ParticipantResponse {
  id?: string;
  event: string;
  participant_details: Record<string, string>;
}

export interface TemplateRequest {
  id?: string;
  template_name: string;
  html_content: string;
}

export interface TemplateResponse {
  id?: string;
  template_name: string;
  html_content: string;
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
  if (!data.id) throw new Error("Missing event id for update");

  return apiFetch("/app/api/event/", {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const getParticipants = (
  eventId: string
): Promise<ParticipantResponse[]> => {
  return apiFetch(`/app/api/participant?event=${eventId}`, {
    method: "GET",
  });
};

export const createParticipant = (
  eventId: string,
  data: ParticipantRequest
): Promise<ParticipantRequest> => {
  return apiFetch(`/app/api/participant/?event=${eventId}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateParticipant = (
  data: ParticipantRequest
): Promise<ParticipantRequest> => {
  if (!data.id) throw new Error("Missing participant id for update");

  return apiFetch(`/app/api/participant/?participant=${data.id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const getTemplates = (): Promise<TemplateResponse[]> => {
  return apiFetch("/app/api/template/", {
    method: "GET",
  });
};

export const getTemplateDetails = (id: string): Promise<TemplateResponse> => {
  return apiFetch(`/app/api/template/${id}/`, { method: "GET" });
};

export const createTemplate = (
  data: TemplateRequest
): Promise<TemplateRequest> => {
  return apiFetch("/app/api/template/", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateTemplate = (
  data: TemplateRequest
): Promise<TemplateRequest> => {
  if (!data.id) throw new Error("Missing template id for update");

  return apiFetch("/app/api/template/", {
    method: "PUT",
    body: JSON.stringify(data),
  });
};
