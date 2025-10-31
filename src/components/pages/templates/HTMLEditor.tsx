import { useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { templateSchema, type TemplateForm } from "@/schemas/app";
import { useFetchEvents } from "@/hooks/useEvents";
import {
  useCreateTemplate,
  useFetchTemplateDetails,
  useUpdateTemplate,
} from "@/hooks/useTemplates";
import {
  getSelectedTemplate,
  setSelectedTemplate,
} from "@/state/selectedTemplate";
import { SearchableSelect } from "@/components/common/SearchableSelect";
import { useMatch, useParams } from "@tanstack/react-router";
import { setCardMode } from "@/state/cardMode";

const VOID_TAGS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

export function HTMLEditor() {
  // ✅ Safely detect if current route is edit
  const isEditRoute = useMatch({
    from: "/app/$template/template",
    shouldThrow: false,
  });

  let templateId: string | undefined = undefined;

  if (isEditRoute) {
    const params = useParams({ from: "/app/$template/template" });
    templateId = params.template;
  }

  const isEditMode = Boolean(templateId);

  // ✅ Update card mode globally
  useEffect(() => {
    setCardMode(isEditMode ? "edit template" : "create template");
  }, [isEditMode]);

  // ✅ API hooks
  const { data: events } = useFetchEvents();
  const createTemplateMutation = useCreateTemplate();
  const updateTemplateMutation = useUpdateTemplate();
  const selectedTemplate = getSelectedTemplate();

  const { data: templateData, isLoading } = useFetchTemplateDetails(
    templateId,
    {
      enabled: isEditMode,
    }
  );

  // ✅ Editor state
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const [code, setCode] = useState("<h1>paperLess 📄</h1>");
  const [srcDoc, setSrcDoc] = useState(code);

  // ✅ React Hook Form setup
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TemplateForm>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      id: "",
      template_name: "",
      html_content: "",
    },
  });

  // ✅ Pre-fill data in edit mode
  useEffect(() => {
    const dataToUse = isEditMode ? templateData : selectedTemplate;

    if (dataToUse) {
      setValue("id", dataToUse.id || "");
      setValue("template_name", dataToUse.template_name || "");
      setValue("html_content", dataToUse.html_content || "");
      setCode(dataToUse.html_content || "<h1>Hello World 👋</h1>");
      setSrcDoc(dataToUse.html_content || "<h1>Hello World 👋</h1>");
    }
  }, [isEditMode, templateData, selectedTemplate, setValue]);

  // ✅ Live preview delay
  useEffect(() => {
    const id = setTimeout(() => setSrcDoc(code), 250);
    return () => clearTimeout(id);
  }, [code]);

  // ✅ Handle auto tag closing
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== ">") return;
    const ta = taRef.current;
    if (!ta) return;

    const { selectionStart, selectionEnd, value } = ta;
    const before = value.slice(0, selectionStart);
    const after = value.slice(selectionEnd);

    const match = before.match(/<([a-zA-Z][\w-]*)[^>]*$/);
    if (!match) return;

    const tag = match[1].toLowerCase();
    if (
      VOID_TAGS.has(tag) ||
      before.endsWith("</") ||
      before.endsWith("/>") ||
      after.trimStart().startsWith(`</${tag}>`)
    ) {
      return;
    }

    e.preventDefault();
    const closing = `></${tag}>`;
    const newValue = before + closing + after;
    const cursorPos = selectionStart + 1;

    ta.value = newValue;
    ta.setSelectionRange(cursorPos, cursorPos);
    setCode(newValue);
  };

  // ✅ Submit handler
  const onSubmit = (data: TemplateForm) => {
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
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
        <Card className="h-full border-none shadow-none">
          <CardContent className="flex flex-col gap-3 p-3">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Template Name"
                {...register("template_name")}
                className="p-[19px]"
              />
              {errors.template_name && (
                <p className="text-red-500 pl-1 text-[12px]">
                  {errors.template_name.message}
                </p>
              )}
              <SearchableSelect
                events={events ?? []}
                onSelect={() => {
                  if (!templateData) return;
                  setSelectedTemplate(templateData);
                  setCode(templateData.html_content);
                  setSrcDoc(templateData.html_content);
                }}
              />
            </div>

            {/* ✅ Textarea with skeleton */}
            <div className="relative w-full h-[400px]">
              <Controller
                name="html_content"
                control={control}
                render={() => (
                  <Textarea
                    ref={taRef}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onKeyDown={handleKeyDown}
                    spellCheck={false}
                    disabled={isLoading}
                    className="w-full h-full resize-none font-mono text-xs p-3 outline-none focus-visible:ring-0 bg-transparent border mt-2"
                  />
                )}
              />
              {isLoading && (
                <div className="absolute inset-0 z-10 pointer-events-none">
                  <Skeleton className="w-full h-full rounded-md" />
                </div>
              )}
            </div>
          </CardContent>

          <div className="p-3 border-t">
            <Button type="submit" className="w-full">
              {isEditMode ? "Update Template" : "Save Template"}
            </Button>
          </div>
        </Card>
      </form>

      {/* ✅ Live Preview */}
      <Card className="h-full border shadow-none">
        <CardContent className="p-0 h-[calc(100vh-80px)] overflow-hidden">
          <iframe
            srcDoc={srcDoc}
            title="Live HTML Preview"
            sandbox="allow-scripts allow-same-origin"
            className="w-full h-full bg-white"
          />
        </CardContent>
      </Card>
    </div>
  );
}
