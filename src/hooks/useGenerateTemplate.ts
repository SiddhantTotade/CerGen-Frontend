import { useMutation } from "@tanstack/react-query"
import { generateEventTemplate, type GenerateEventTemplateRequest, type GenerateEventTemplateResponse } from "@/api/app"

export const useGenerateEventTemplate = () => {
    return useMutation<
        GenerateEventTemplateResponse,
        Error,
        GenerateEventTemplateRequest
    >({
        mutationFn: generateEventTemplate,
    })
}
