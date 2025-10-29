import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createTemplate,
  getTemplates,
  getTemplateDetails,
  updateTemplate,
} from "@/api/app";
import type { TemplateRequest, TemplateResponse } from "@/api/app";

export const useFetchTemplates = () => {
  return useQuery<TemplateResponse[], Error>({
    queryKey: ["templates"],
    queryFn: getTemplates,
    staleTime: 1000 * 60 * 5,
  });
};

export const useFetchTemplateDetails = (templateId: string) => {
  return useQuery<TemplateResponse, Error>({
    queryKey: ["template", templateId],
    queryFn: () => getTemplateDetails(templateId),
    enabled: !!templateId,
  });
};

export const useCreateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation<TemplateResponse, Error, TemplateRequest>({
    mutationFn: createTemplate,
    onSuccess: (newTemplate) => {
      queryClient.setQueryData<TemplateResponse[]>(
        ["templates"],
        (old = []) => [...old, newTemplate]
      );
    },
  });
};

export const useUpdateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation<TemplateResponse, Error, TemplateRequest>({
    mutationFn: updateTemplate,
    onSuccess: (updatedTemplate) => {
      queryClient.setQueryData<TemplateResponse[]>(["templates"], (old = []) =>
        old.map((tpl) =>
          tpl.id === updatedTemplate.id ? updatedTemplate : tpl
        )
      );

      queryClient.setQueryData(["selectedTemplate"], updatedTemplate);
    },
  });
};
