import { useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Controller } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFetchEvents } from "@/hooks/useEvents";
import { Select, SelectContent, SelectItem } from "@/components/ui/select";
import {
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { Input } from "@/components/ui/input";
import { templateSchema, type TemplateForm } from "@/schemas/app";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateTemplate } from "@/hooks/useTemplates";
import { setSelectedTemplate } from "@/state/selectedTemplate";
import { FormCard } from "@/components/common/FormCard";
import { Button } from "@/components/ui/button";

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
  const { data: events, isLoading } = useFetchEvents();
  const [code, setCode] = useState<string>(`<h1>Hello World 👋</h1>`);
  const [srcDoc, setSrcDoc] = useState<string>(code);
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const createTemplateMutation = useCreateTemplate();
  const schema = templateSchema;
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TemplateForm>({
    resolver: zodResolver(schema as any),
    defaultValues: { id: undefined, template_name: "", html_content: "" },
  });

  useEffect(() => {
    const id = setTimeout(() => setSrcDoc(code), 250);
    return () => clearTimeout(id);
  }, [code]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
    setValue("html_content", e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== ">") return;

    const ta = taRef.current;
    if (!ta) return;

    const value = ta.value;
    const start = ta.selectionStart ?? 0;
    const end = ta.selectionEnd ?? 0;

    const futureBefore = value.slice(0, start) + ">";

    const match = futureBefore.match(/<([a-zA-Z][\w-]*)\b[^>]*>$/);

    if (!match) return;

    const tag = match[1].toLowerCase();

    if (VOID_TAGS.has(tag)) return;

    const after = value.slice(end);
    if (after.startsWith(`</${tag}`)) {
      return;
    }

    e.preventDefault();

    const before = value.slice(0, start);
    const afterAll = value.slice(end);
    const inserted = ">" + `</${tag}>`;
    const newValue = before + inserted + afterAll;

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
    const formData = data as TemplateForm;

    const payload = {
      id: formData.id,
      template_name: formData.template_name,
      html_content: formData.html_content,
    };

    createTemplateMutation.mutate(payload as any, {
      onSuccess: () => {
        alert("Template created successfully"), setSelectedTemplate(payload);
      },
    });
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <FormCard>
        <form onSubmit={handleSubmit(onSubmit as any)}>
          <div className="w-1/2">
            <Card className="h-full rounded-none border-none">
              <CardHeader className="border-b">
                <CardTitle>HTML Editor</CardTitle>
              </CardHeader>
              <div>
                <Input
                  type="text"
                  placeholder="Template Name"
                  {...register("template_name")}
                />
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Event" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {events?.map((event: any) => (
                        <SelectItem key={event.id} value={event.details}>
                          {event.event}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <CardContent className="p-0 h-[calc(100vh-100px)] overflow-hidden">
                <Controller
                  name="html_content"
                  control={control}
                  defaultValue={code}
                  render={({ field }) => (
                    <Textarea
                      inputRef={taRef}
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        handleChange(e);
                      }}
                      onKeyDown={handleKeyDown}
                      spellCheck={false}
                      className="w-full h-full resize-none font-mono text-sm p-3 outline-none focus-visible:ring-0 bg-transparent"
                    />
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className="w-1/2">
            <Card className="h-full rounded-none border-none">
              <CardHeader className="border-b">
                <CardTitle>Live Preview</CardTitle>
              </CardHeader>
              <CardContent className="p-0 h-[calc(100vh-100px)] overflow-hidden">
                <iframe
                  srcDoc={srcDoc}
                  title="Live HTML Preview"
                  sandbox="allow-scripts allow-same-origin"
                  className="w-full h-full bg-white"
                />
              </CardContent>
            </Card>
          </div>
          <Button type="submit">Save</Button>
        </form>
      </FormCard>
    </div>
  );
}
