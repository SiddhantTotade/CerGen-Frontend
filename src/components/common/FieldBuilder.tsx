import { useEffect } from "react";
import { Trash2, Plus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";

import { FormCard } from "./FormCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCardMode } from "@/hooks/useCardMode";
import { useSelectedEvent } from "@/hooks/useSelectedEvent";
import { useCreateEvent, useUpdateEvent } from "@/hooks/useEvents";
import { eventSchema, type EventForm as BaseEventForm } from "@/schemas/app";

export type EventForm = BaseEventForm & { id?: string };

export function FieldBuilder() {
  const createEventMutation = useCreateEvent();
  const updateEventMutation = useUpdateEvent();

  const { mode, setMode } = useCardMode();
  const { selectedEvent, setSelectedEvent } = useSelectedEvent();

  const { register, control, handleSubmit, formState: { errors }, reset } = useForm<EventForm>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      id: undefined,
      event: "",
      details: [{ label: "", value: "" }],
    },
  });


  const { fields, append, remove } = useFieldArray({
    control,
    name: "details",
  });

  useEffect(() => {
    if (mode === "edit" && selectedEvent) {
      const detailsArray = Object.entries(selectedEvent.details).map(
        ([label, value]) => ({ label, value })
      );

      reset({
        id: selectedEvent.id,
        event: selectedEvent.event,
        details: detailsArray,
      });
    }
  }, [mode, selectedEvent, reset]);


  const onSubmit = (data: EventForm) => {
    const detailsRecord: Record<string, string> = {};
    data.details.forEach(({ label, value }) => {
      if (label) detailsRecord[label] = value || "";
    });

    const payload = {
      ...data,
      id: String(data.id),
      event: data.event,
      details: detailsRecord,
    };

    if (mode === "edit") {
      updateEventMutation.mutate(payload, {
        onSuccess: () => {
          alert("Event Updated Successfully");
          setSelectedEvent(payload);
          setMode("show");
        },
        onError: (err) => console.error(err),
      });
    } else if (mode === "create") {
      createEventMutation.mutate(payload, {
        onSuccess: () => {
          alert("Event Created Successfully");
          setSelectedEvent(payload);
          setMode("show");
        },
        onError: (err) => console.error(err),
      });
    }

    reset({
      id: undefined,
      event: "",
      details: [{ label: "", value: "" }],
    });
  };

  return (
    <FormCard>
      <form
        className="flex flex-col h-[380px]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-xl font-bold mb-2">
          {mode === "edit" ? "Edit Event" : "Create Event"}
        </h2>

        <div className="flex-1 overflow-y-auto p-2">
          <Input
            type="text"
            placeholder="Title of the Event"
            {...register("event")}
            className="mb-3"
          />
          {errors.event && (
            <p className="text-red-500 text-sm">{errors.event.message}</p>
          )}

          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2 mb-3">
              <Input
                type="text"
                placeholder="Field Label"
                {...register(`details.${index}.label` as const)}
                className="flex-1"
              />
              <Input
                type="text"
                placeholder="Field Value"
                {...register(`details.${index}.value` as const)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
              >
                <Trash2 />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex justify-between pt-3 border-t">
          <Button
            size="sm"
            type="button"
            variant="outline"
            onClick={() => append({ label: "", value: "" })}
          >
            <Plus /> Add Field
          </Button>
          <Button asChild={false} size="sm" type="submit">
            {mode === "edit" ? "Update" : "Submit"}
          </Button>
        </div>
      </form>
    </FormCard>
  );
}
