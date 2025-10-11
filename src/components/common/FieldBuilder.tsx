import { Trash2, Plus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";

import { FormCard } from "./FormCard";
import { Input } from "@/components/ui/input";
import { setCardMode } from "@/state/cardMode";
import { Button } from "@/components/ui/button";
import { useCreateEvent } from "@/hooks/useEvents";
import { eventSchema, type EventForm } from "@/schemas/app";

export function FieldBuilder() {
  const eventMutation = useCreateEvent();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EventForm>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      event: "",
      details: [{ label: "", value: "" }],
    },
  });

  const { fields, append } = useFieldArray({
    control,
    name: "details",
  });

  const onSubmit = (data: EventForm) => {
    const detailsRecord: Record<string, string> = {};

    data.details.forEach(({ label, value }) => {
      if (label) detailsRecord[label] = value || "";
    });

    const payload = {
      event: data.event,
      details: detailsRecord,
    };

    eventMutation.mutate(payload, {
      onSuccess: () => alert("Event Created Successfully"),
      onError: (err) => console.log(err),
    });

    reset();
  };

  return (
    <FormCard>
      <form
        className="flex flex-col h-[380px]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-xl font-bold mb-2">Create Event</h2>

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
                className="cursor-pointer"
                onClick={() => setCardMode("none")}
                disabled={fields.length === 1}
              >
                <Trash2 size="sm" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex justify-between pt-3 border-t">
          <Button
            size="sm"
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={() => append({ label: "", value: "" })}
          >
            <Plus /> Add Field
          </Button>
          <Button className="cursor-pointer" size="sm" type="submit">
            Submit
          </Button>
        </div>
      </form>
    </FormCard>
  );
}
