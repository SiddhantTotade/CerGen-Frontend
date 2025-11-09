import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
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
import { eventKeysKey } from "@/state/selectedTemplateKeys";

import TemplateFields from "./TemplateField";
import EventKeysSection from "./EventKeysSection";
import HTMLTextEditor from "./HTMLTextEditor";

interface TemplateFormProps {
  templateId?: string;
  isEditMode: boolean;
  onPreviewChange?: (value: string) => void;
}

export default function TemplateForm({
  templateId,
  isEditMode,
  onPreviewChange,
}: TemplateFormProps) {
  const { data: events } = useFetchEvents();
  const createTemplate = useCreateTemplate();
  const updateTemplate = useUpdateTemplate();
  const selectedTemplate = getSelectedTemplate();

  const queryClient = useQueryClient();
  const [eventKeys, setEventKeysState] = useState(
    () => queryClient.getQueryData(eventKeysKey) ?? null
  );

  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe(() => {
      const data = queryClient.getQueryData(eventKeysKey) ?? null;
      setEventKeysState(data);
    });
    return unsubscribe;
  }, [queryClient]);

  const { data: templateData, isLoading } = useFetchTemplateDetails(
    templateId,
    {
      enabled: isEditMode,
    }
  );

  const [code, setCode] = useState("<h1>paperLess 📄</h1>");

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TemplateForm>({
    resolver: zodResolver(templateSchema),
    defaultValues: { id: "", template_name: "", html_content: "" },
  });

  useEffect(() => {
    const dataToUse = isEditMode ? templateData : selectedTemplate;
    if (dataToUse) {
      const id = dataToUse.id || "";
      const templateName =
        //   @ts-ignore
        dataToUse.template_name || dataToUse.templateName || "";
      const htmlContent =
        dataToUse.html_content ||
        //   @ts-ignore
        dataToUse.htmlContent ||
        "<h1>paperLess 📄</h1>";

      setValue("id", id);
      setValue("template_name", templateName);
      setValue("html_content", htmlContent);
      setCode(htmlContent);
      onPreviewChange?.(htmlContent);
    }
  }, [isEditMode, templateData, selectedTemplate, setValue]);

  useEffect(() => {
    const id = setTimeout(() => {
      onPreviewChange?.(code);
    }, 250);
    return () => clearTimeout(id);
  }, [code]);

  const onSubmit = (data: TemplateForm) => {
    const payload = {
      id: data.id,
      template_name: data.template_name,
      html_content: code,
    };
    const mutation = isEditMode ? updateTemplate : createTemplate;

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
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-1/2">
      <Card id="custom_card" className="h-full relative border-none shadow-none w-full text-white">
        <CardContent className="flex flex-col gap-3 p-3">
          <TemplateFields register={register} errors={errors} events={events} />
          <EventKeysSection eventKeys={eventKeys} />
          <div className="relative w-full">
            <Controller
              name="html_content"
              control={control}
              render={() => (
                <HTMLTextEditor
                  code={code}
                  setCode={setCode}
                  disabled={isLoading}
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
        <div className="p-3 absolute w-full flex justify-end bottom-0">
          <Button type="submit" className="bg-blue-500 hover:bg-blue-600 cursor-pointer">
            {isEditMode ? "Update Template" : "Save Template"}
          </Button>
        </div>
      </Card>
    </form>
  );
}
