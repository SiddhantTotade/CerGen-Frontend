import { useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
import { FormCard } from "@/components/common/FormCard";
import { SearchableSelect } from "@/components/common/SearchableSelect";
import { useParams } from "@tanstack/react-router";

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
  const { template: templateId } = useParams({
    from: "/app/$template/template",
  });
  const { data: events } = useFetchEvents();
  const createTemplateMutation = useCreateTemplate();
  const updateTemplateMutation = useUpdateTemplate();
  const selectedTemplate = getSelectedTemplate();
  const { data: templates, isLoading } = useFetchTemplateDetails(templateId);

  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const [code, setCode] = useState(
    selectedTemplate?.html_content ?? `<h1>Hello World 👋</h1>`
  );
  const [srcDoc, setSrcDoc] = useState(code);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TemplateForm>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      id: selectedTemplate?.id,
      template_name: selectedTemplate?.template_name ?? "",
      html_content: selectedTemplate?.html_content ?? code,
    },
  });

  useEffect(() => {
    const templateData = templates ?? selectedTemplate;

    if (templateData) {
      setValue("id", templateData.id);
      setValue("template_name", templateData.template_name);
      setValue("html_content", templateData.html_content);
      setCode(templateData.html_content);
      setSrcDoc(templateData.html_content);
    }
  }, [templates, selectedTemplate, setValue]);

  useEffect(() => {
    const id = setTimeout(() => setSrcDoc(code), 250);
    return () => clearTimeout(id);
  }, [code]);

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

  const onSubmit = (data: TemplateForm) => {
    const payload = {
      id: data.id,
      template_name: data.template_name,
      html_content: code,
    };

    const isUpdate = !!data.id;

    const mutation = isUpdate ? updateTemplateMutation : createTemplateMutation;

    mutation.mutate(payload, {
      onSuccess: (res) => {
        alert(
          isUpdate
            ? "Template updated successfully"
            : "Template created successfully"
        );
        setSelectedTemplate(res);
      },
    });
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <FormCard className="w-1/2 border-r">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col h-full"
        >
          <Card className="h-full border-none shadow-none">
            <CardHeader className="border-b">
              <CardTitle>
                {selectedTemplate ? "Edit Template" : "Create Template"}
              </CardTitle>
            </CardHeader>

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
                    if (!templates) return;

                    const template = templates;

                    setSelectedTemplate(template);
                    setCode(template.html_content);
                    setSrcDoc(template.html_content);
                  }}
                />
              </div>
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
                    className="w-full h-[400px] resize-none font-mono text-xs p-3 outline-none focus-visible:ring-0 bg-transparent border mt-2"
                  />
                )}
              />
            </CardContent>

            <div className="p-3 border-t">
              <Button type="submit" className="w-full">
                {selectedTemplate ? "Update Template" : "Save Template"}
              </Button>
            </div>
          </Card>
        </form>
      </FormCard>

      <FormCard className="w-1/2">
        <Card className="h-full border-none shadow-none">
          <CardHeader className="border-b">
            <CardTitle>Live Preview</CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-[calc(100vh-80px)] overflow-hidden">
            <iframe
              srcDoc={srcDoc}
              title="Live HTML Preview"
              sandbox="allow-scripts allow-same-origin"
              className="w-full h-full bg-white"
            />
          </CardContent>
        </Card>
      </FormCard>
    </div>
  );
}
