import { useMutation } from "@tanstack/react-query"
import { generateEventTemplate, generateParticipantTemplate, type GenerateParticipantTemplateRequest, type GenerateParticipantTemplateResponse, type GenerateEventTemplateRequest, type GenerateEventTemplateResponse } from "@/api/app"

export const useGenerateEventTemplate = () => {
    return useMutation<GenerateEventTemplateResponse, Error, GenerateEventTemplateRequest>({
        mutationFn: generateEventTemplate,
    })
}

export const useGenerateParticipantTemplate = () => {
    return useMutation<GenerateParticipantTemplateResponse, Error, GenerateParticipantTemplateRequest>({
        mutationFn: generateParticipantTemplate
    })
}