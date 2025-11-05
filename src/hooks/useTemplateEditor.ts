import { useEffect, useRef, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { templateSchema, type TemplateForm } from "@/schemas/app";
import {
  useCreateTemplate,
  useFetchTemplateDetails,
  useUpdateTemplate,
} from "@/hooks/useTemplates";
import {
  getSelectedTemplate,
  setSelectedTemplate,
} from "@/state/selectedTemplate";
import { useMatch, useParams } from "@tanstack/react-router";
import { setCardMode } from "@/state/cardMode";
import { eventKeysKey } from "@/state/selectedTemplateKeys";
import { useQueryClient } from "@tanstack/react-query";

const VOID_TAGS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input", "link",
  "meta", "param", "source", "track", "wbr",
]);

export function useTemplateEditor() {
  const isEditRoute = useMatch({
    from: "/app/$template/template",
    shouldThrow: false,
  });
  const params = useParams({ from: "/app/$template/template" });
  const templateId = isEditRoute ? params.template : undefined;
  const isEditMode = Boolean(templateId);

  useEffect(() => {
    setCardMode(isEditMode ? "edit template" : "create template");
  }, [isEditMode]);

  const createTemplateMutation = useCreateTemplate();
  const updateTemplateMutation = useUpdateTemplate();
  const selectedTemplate = getSelectedTemplate();
  const queryClient = useQueryClient();

  const { data: templateData, isLoading: isTemplateLoading } = useFetchTemplateDetails(
    templateId,
    { enabled: isEditMode }
  );

  const [eventKeys, setEventKeysState] = useState(() => queryClient.getQueryData(eventKeysKey) ?? null);
  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe(() => {
      const data = queryClient.getQueryData(eventKeysKey) ?? null;
      setEventKeysState(data);
    });
    return unsubscribe;
  }, [queryClient]);

  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const [code, setCode] = useState("<h1>paperLess 📄</h1>");
  const [srcDoc, setSrcDoc] = useState(code);

  const formMethods = useForm<TemplateForm>({
    resolver: zodResolver(templateSchema),
    defaultValues: { id: "", template_name: "", html_content: "" },
  });
  const { handleSubmit, setValue } = formMethods;

  useEffect(() => {
    const dataToUse = isEditMode ? templateData : selectedTemplate;

    if (dataToUse) {
      const id = dataToUse.id || "";
    //   @ts-ignore
      const templateName = dataToUse.template_name || dataToUse.templateName || "";
      // @ts-ignore
      const htmlContent = dataToUse.html_content || dataToUse.htmlContent || "<h1>paperLess 📄</h1>";

      setValue("id", id);
      setValue("template_name", templateName);
      setValue("html_content", htmlContent);
      setCode(htmlContent);
      setSrcDoc(htmlContent);
    }
  }, [isEditMode, templateData, selectedTemplate, setValue]);

  useEffect(() => {
    const id = setTimeout(() => setSrcDoc(code), 250);
    return () => clearTimeout(id);
  }, [code]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== ">") return;
    const ta = taRef.current;
    if (!ta) return;

    const { selectionStart, selectionEnd, value } = ta;
    const before = value.slice(0, selectionStart);
    const after = value.slice(selectionEnd);

    const match = before.match(/<([a-zA-Z][\w-]*)[^>]*$/);
    if (!match) return;

    const tag = match[1].toLowerCase();
    if (VOID_TAGS.has(tag) || before.endsWith("</") || before.endsWith("/>") || after.trimStart().startsWith(`</${tag}>`)) {
      return;
    }

    e.preventDefault();
    const closing = `></${tag}>`;
    const newValue = before + closing + after;
    const cursorPos = selectionStart + 1;

    ta.value = newValue;
    ta.setSelectionRange(cursorPos, cursorPos);
    setCode(newValue);
  }, []);

  const onSubmit = handleSubmit((data: TemplateForm) => {
    const payload = {
      id: data.id,
      template_name: data.template_name,
      html_content: code,
    };

    const mutation = isEditMode
      ? updateTemplateMutation
      : createTemplateMutation;

    mutation.mutate(payload, {
      onSuccess: (res) => {
        alert(
          isEditMode
            ? "Template updated successfully"
            : "Template created successfully"
        );
        setSelectedTemplate(res);
      },
    });
  });

  return {
    code,
    setCode,
    srcDoc,
    taRef,
    eventKeys,

    ...formMethods,
    onSubmit,

    isEditMode,
    isSubmitting: createTemplateMutation.isPending || updateTemplateMutation.isPending,
    isTemplateLoading,

    handleKeyDown,
  };
}