import { useQuery } from "@tanstack/react-query";
import {
  setSelectedTemplate,
  getSelectedTemplate,
  type SelectedTemplate,
  selectedTemplateKey,
} from "@/state/selectedTemplate";

export function useSelectedTemplate() {
  const { data: selectedTemplate = null } = useQuery<SelectedTemplate | null>({
    queryKey: selectedTemplateKey,
    queryFn: getSelectedTemplate,
    initialData: null,
  });

  return {
    selectedTemplate,
    setSelectedTemplate,
  };
}
