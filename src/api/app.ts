import { apiFetch, graphqlFetch } from "./client";

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

export const getEvents = async () => {
  const query = `
    query Events {
      events {
        id
        event
        details
        createdAt
        updatedAt
      }
    }
  `
  const data = await graphqlFetch<{ events: EventResponse[] }>(query)
  return data.events
}

export const createEvent = async (data: EventRequest): Promise<EventRequest> => {
  const mutation = `
    mutation CreateEvent($event: String!, $details: GenericScalar!) {
      createEvent(event: $event, details: $details) {
        event {
          id
          event
          details
          createdAt
          updatedAt
        }
      }
    }
  `;

  const variables = {
    event: data.event,
    details: data.details,
  };

  const response = await graphqlFetch<{ createEvent: { event: EventRequest } }>(
    mutation,
    variables
  );

  return response.createEvent.event;
};


export const updateEvent = async (data: EventRequest): Promise<EventResponse> => {
  if (!data.id) throw new Error("Missing event id for update");

  const mutation = `
    mutation UpdateEvent($id: Int!, $event: String!, $details: GenericScalar!) {
      updateEvent(id: $id, event: $event, details: $details) {
        event {
          id
          event
          details
          createdAt
          updatedAt
        }
      }
    }
  `;

  const variables = {
    id: Number(data.id),
    event: data.event,
    details: data.details,
  };

  const response = await graphqlFetch<{ updateEvent: { event: EventResponse } }>(mutation, variables);
  return response.updateEvent.event;
};


export const getParticipants = async (
  eventId: string
): Promise<ParticipantResponse[]> => {
  const query = `
    query GetParticipants($eventId: Int) {
      allParticipants(eventId: $eventId) {
        id
        participantDetails
      }
    }
  `;

  const variables = { eventId: Number(eventId) };

  const response = await graphqlFetch<{ allParticipants: ParticipantResponse[] }>(
    query,
    variables
  );

  return response.allParticipants;
};


export const createParticipant = async (
  eventId: string,
  data: ParticipantRequest
): Promise<ParticipantRequest> => {
  const mutation = `
    mutation CreateParticipant($eventId: Int!, $participantDetails: GenericScalar!) {
      createParticipant(eventId: $eventId, participantDetails: $participantDetails) {
        participant {
          id
          participantDetails
        }
      }
    }
  `;

  const variables = {
    eventId: Number(eventId),
    participantDetails: data.participant_details,
  };

  const response = await graphqlFetch<{ createParticipant: { participant: ParticipantRequest } }>(
    mutation,
    variables
  );

  return response.createParticipant.participant;
};

export const updateParticipant = async (
  data: ParticipantRequest
): Promise<ParticipantRequest> => {
  if (!data.id) throw new Error("Missing participant id for update");

  const mutation = `
    mutation UpdateParticipant($id: Int!, $participantDetails: JSONString!) {
      updateParticipant(id: $id, participantDetails: $participantDetails) {
        participant {
          id
          participantDetails
        }
      }
    }
  `;

  const variables = {
    id: Number(data.id),
    participantDetails: JSON.stringify(data.participant_details),
  };

  const response = await graphqlFetch<{ updateParticipant: { participant: ParticipantRequest } }>(
    mutation,
    variables
  );

  return response.updateParticipant.participant;
};

export const getTemplates = async (): Promise<TemplateResponse[]> => {
  const query = `
    query GetTemplates {
      templates {
        id
        templateName
        htmlContent
        createdAt
        updatedAt
      }
    }
  `;

  const response = await graphqlFetch<{ templates: TemplateResponse[] }>(query);
  return response.templates;
};

export const getTemplateDetails = async (id: string): Promise<TemplateResponse> => {
  const query = `
    query GetTemplateDetails($id: Int!) {
      template(id: $id) {
        id
        templateName
        htmlContent
        createdAt
        updatedAt
      }
    }
  `;

  const variables = { id: Number(id) };

  const response = await graphqlFetch<{ template: TemplateResponse }>(query, variables);
  return response.template;
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
