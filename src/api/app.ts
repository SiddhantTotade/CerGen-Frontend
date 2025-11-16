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

export interface EventKeyResponse {
  detailKeys: string[];
  participantDetailKeys: string[];
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

export interface GenerateEventTemplateRequest {
  event_id?: string;
  template_id: string;
  orientation: string;
}

export interface GenerateEventTemplateResponse {
  success: boolean;
  message: string;
  data: {
    html: string;
    pdf_data: string;
  };
}

export interface GenerateParticipantTemplateRequest {
  event_id?: string
  template_id: string
  orientation: string
}

export interface GenerateParticipantTemplateResponse {
  success: boolean;
  message: string;
  data: {
    html: string;
    pdf_data: string;
  }
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
  `;
  const data = await graphqlFetch<{ events: EventResponse[] }>(query);
  return data.events;
};

export const createEvent = async (
  data: EventRequest
): Promise<EventRequest> => {
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

export const updateEvent = async (
  data: EventRequest
): Promise<EventResponse> => {
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

  const response = await graphqlFetch<{
    updateEvent: { event: EventResponse };
  }>(mutation, variables);
  return response.updateEvent.event;
};

export const deleteEvent = async (ids: number[]) => {
  if (!ids?.length) throw new Error("Missing event ids for delete");

  const mutation = `
    mutation DeleteEvent($ids: [Int!]!) {
      deleteEvent(ids: $ids) {
        ok
      }
    }
  `;

  const variables = { ids };

  const response = await graphqlFetch<{
    deleteEvent: { ok: boolean };
  }>(mutation, variables);

  return response.deleteEvent.ok;
};


export const getParticipants = async (
  eventId: string
): Promise<ParticipantResponse[]> => {
  const query = `
query GetParticipants($eventId: Int) {
  allParticipants(eventId: $eventId) {
    id
    participantDetails
    event {
      id
      event
      details
    }
  }
}

  `;

  const variables = { eventId: Number(eventId) };

  const response = await graphqlFetch<{
    allParticipants: ParticipantResponse[];
  }>(query, variables);

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

  const response = await graphqlFetch<{
    createParticipant: { participant: ParticipantRequest };
  }>(mutation, variables);

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

  const response = await graphqlFetch<{
    updateParticipant: { participant: ParticipantRequest };
  }>(mutation, variables);

  return response.updateParticipant.participant;
};

export const deleteParticipant = async (ids: number[]) => {
  if (!ids?.length) throw new Error("Missing participant ids for delete");

  const mutation = `
    mutation DeleteParticipant($ids: [Int!]!) {
      deleteParticipant(ids: $ids) {
        ok
      }
    }
  `;

  const variables = { ids };

  const response = await graphqlFetch<{
    deleteParticipant: { ok: boolean };
  }>(mutation, variables);

  return response.deleteParticipant.ok;
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

export const getTemplateDetails = async (
  id: string
): Promise<TemplateResponse> => {
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

  const response = await graphqlFetch<{ template: TemplateResponse }>(
    query,
    variables
  );
  return response.template;
};

export const createTemplate = async (
  data: TemplateRequest
): Promise<TemplateResponse> => {
  const mutation = `
    mutation CreateTemplate($templateName: String!, $htmlContent: String!) {
      createTemplate(templateName: $templateName, htmlContent: $htmlContent) {
        template {
          id
          templateName
          htmlContent
          createdAt
          updatedAt
        }
      }
    }
  `;

  const variables = {
    templateName: data.template_name,
    htmlContent: data.html_content,
  };

  const response = await graphqlFetch<{
    createTemplate: { template: TemplateResponse };
  }>(mutation, variables);

  return response.createTemplate.template;
};

export const updateTemplate = async (
  data: TemplateRequest
): Promise<TemplateResponse> => {
  const query = `
    mutation UpdateTemplate($id: Int!, $templateName: String!, $htmlContent: String!) {
      updateTemplate(id: $id, templateName: $templateName, htmlContent: $htmlContent) {
        template {
          id
          templateName
          htmlContent
          createdAt
          updatedAt
        }
      }
    }
  `;

  const variables = {
    id: Number(data.id),
    templateName: data.template_name,
    htmlContent: data.html_content,
  };

  const response = await graphqlFetch<{
    updateTemplate: { template: TemplateResponse };
  }>(query, variables);

  // @ts-ignore
  return response.data.updateTemplate.template;
};

export const deleteTemplate = async (ids: number[]) => {
  if (!ids?.length) throw new Error("Missing template ids for delete");

  const mutation = `
    mutation DeleteTemplate($ids: [Int!]!) {
      deleteTemplate(ids: $ids) {
        ok
      }
    }
  `;

  const variables = { ids };

  const response = await graphqlFetch<{
    deleteTemplate: { ok: boolean };
  }>(mutation, variables);

  return response.deleteTemplate.ok;
};


export const getEventKeys = async (
  eventId: string
): Promise<EventKeyResponse> => {
  const query = `
    query GetEventKeys($eventId: Int!) {
      eventData(eventId: $eventId) {
        detailKeys
        participantDetailKeys
      }
    }
  `;

  const variables = { eventId: Number(eventId) };

  const response = await graphqlFetch<{ eventData: EventKeyResponse }>(
    query,
    variables
  );
  return response.eventData;
};

export const generateEventTemplate = (data: GenerateEventTemplateRequest): Promise<GenerateEventTemplateResponse> => {
  return apiFetch("/app/api/generate-event/", {
    method: "POST",
    body: JSON.stringify(data),
  }) as Promise<GenerateEventTemplateResponse>;
};

export const generateParticipantTemplate = (data: GenerateParticipantTemplateRequest): Promise<GenerateEventTemplateResponse> => {
  return apiFetch("/app/api/generate-participants/", {
    method: "POST",
    body: JSON.stringify(data)
  }) as Promise<GenerateParticipantTemplateResponse>
}
