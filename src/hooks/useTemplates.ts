import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { createTemplate, getTemplates } from "@/api/app";
import type { TemplateRequest, TemplateResponse } from "@/api/app";

export const useFetchTemplates = () => {
  return useQuery<TemplateResponse[], Error>({
    queryKey: ["templates"],
    queryFn: getTemplates,
    staleTime: 1000 * 60 * 5,
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
