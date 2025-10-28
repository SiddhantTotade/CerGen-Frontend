import { queryClient } from "@/lib/queryClient";

export const selectedTemplateKey = ["selectedTemplate"] as const;

export interface SelectedTemplate {
  id?: string;
  template_name: string;
  html_content: string;
}

export function setSelectedTemplate(template: SelectedTemplate | null) {
  queryClient.setQueryData<SelectedTemplate | null>(
    selectedTemplateKey,
    template
  );
}

export function getSelectedTemplate(): SelectedTemplate | null {
  return (
    queryClient.getQueryData<SelectedTemplate | null>(selectedTemplateKey) ??
    null
  );
}
