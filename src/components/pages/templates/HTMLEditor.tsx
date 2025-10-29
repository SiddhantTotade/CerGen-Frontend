import { useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { templateSchema, type TemplateForm } from "@/schemas/app";
import { useFetchEvents } from "@/hooks/useEvents";
import { useCreateTemplate, useUpdateTemplate } from "@/hooks/useTemplates";
import {
  getSelectedTemplate,
  setSelectedTemplate,
} from "@/state/selectedTemplate";
import { FormCard } from "@/components/common/FormCard";
import { SearchableSelect } from "@/components/common/SearchableSelect";

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
  const { data: events } = useFetchEvents();
  const createTemplateMutation = useCreateTemplate();
  const updateTemplateMutation = useUpdateTemplate();
  const selectedTemplate = getSelectedTemplate();

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
    if (selectedTemplate) {
      setValue("id", selectedTemplate.id);
      setValue("template_name", selectedTemplate.template_name);
      setValue("html_content", selectedTemplate.html_content);
      setCode(selectedTemplate.html_content);
      setSrcDoc(selectedTemplate.html_content);
    }
  }, [selectedTemplate, setValue]);

  useEffect(() => {
    const id = setTimeout(() => setSrcDoc(code), 250);
    return () => clearTimeout(id);
  }, [code]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== ">") return;
    const ta = taRef.current;
    if (!ta) return;

    const value = ta.value;
    const start = ta.selectionStart ?? 0;
    const end = ta.selectionEnd ?? 0;
    const before = value.slice(0, start);
    const after = value.slice(end);
    const match = before.match(/<([a-zA-Z][\w-]*)\b[^>]*>$/);
    if (!match) return;

    const tag = match[1].toLowerCase();
    if (VOID_TAGS.has(tag)) return;
    if (after.startsWith(`</${tag}`)) return;

    e.preventDefault();
    const newValue = before + ">" + `</${tag}>` + after;
    setCode(newValue);

    setTimeout(() => {
      const pos = start + 1;
      if (taRef.current) {
        taRef.current.selectionStart = pos;
        taRef.current.selectionEnd = pos;
        taRef.current.focus();
      }
    }, 0);
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
              <Input
                type="text"
                placeholder="Template Name"
                {...register("template_name")}
              />
              {errors.template_name && (
                <p className="text-red-500 pl-1 text-[12px]">
                  {errors.template_name.message}
                </p>
              )}
              <SearchableSelect
                events={events ?? []}
                onSelect={(v) => console.log(v)}
              />
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
                    className="w-full flex-1 resize-none font-mono text-sm p-3 outline-none focus-visible:ring-0 bg-transparent border mt-2"
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

      <div className="w-1/2">
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
      </div>
    </div>
  );
}
