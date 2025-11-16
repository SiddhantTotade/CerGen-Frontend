import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createTemplate,
  getTemplates,
  getTemplateDetails,
  updateTemplate,
  deleteTemplate,
} from "@/api/app";
import type { TemplateRequest, TemplateResponse } from "@/api/app";

export const useFetchTemplates = () => {
  return useQuery<TemplateResponse[], Error>({
    queryKey: ["templates"],
    queryFn: getTemplates,
    staleTime: 1000 * 60 * 5,
  });
};

export function useFetchTemplateDetails(
  templateId?: string,
  options: { enabled?: boolean } = {}
) {
  return useQuery({
    queryKey: ["templateDetails", templateId],
    queryFn: () => getTemplateDetails(templateId!),
    enabled: !!templateId && (options.enabled ?? true),
  });
}

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

export function useDeleteTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });
}