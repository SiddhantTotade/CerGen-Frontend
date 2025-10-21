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
import { eventSchema, participantSchema, type EventForm as BaseEventForm, type ParticipantForm as BaseParticipantForm } from "@/schemas/app";
import { useSelectedParticipant } from "@/hooks/useSelectedParticipant";
import { useCreateParticipants, useUpdateParticipants } from "@/hooks/useParticipants";

export type EventForm = BaseEventForm & { id?: string };
export type ParticipantForm = BaseParticipantForm & { id?: string }

export type CombinedForm = EventForm | ParticipantForm

export function FieldBuilder({ eventId }: { eventId?: string }) {
  const createEventMutation = useCreateEvent();
  const updateEventMutation = useUpdateEvent();
  const createParticipantMutation = useCreateParticipants(eventId || "")
  const updateParticipantMutation = useUpdateParticipants()

  const { mode, setMode } = useCardMode();
  const { selectedEvent, setSelectedEvent } = useSelectedEvent();
  const { selectedParticipant, setSelectedParticipant } = useSelectedParticipant()

  const isParticipantMode = mode.includes("participant") ? true : false
  const schema = isParticipantMode ? participantSchema : eventSchema

  const { register, control, handleSubmit, formState: { errors }, reset } = useForm<CombinedForm>({
    resolver: zodResolver(schema as any),
    defaultValues: isParticipantMode
      ? ({
        id: undefined,
        event: eventId,
        participant_details: [{ label: "", value: "" }],
      } as BaseParticipantForm)
      : ({
        id: undefined,
        event: "",
        details: [{ label: "", value: "" }],
      } as BaseEventForm),
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: isParticipantMode ? "participant_details" : "details"
  })

  useEffect(() => {
    if (mode === "edit event" && selectedEvent) {
      const detailsArray = Object.entries(selectedEvent.details).map(
        ([label, value]) => ({ label, value })
      );

      reset({
        id: selectedEvent.id,
        event: selectedEvent.event,
        details: detailsArray,
      });

      replace(detailsArray);
    }
    else if (mode === "edit participant" && selectedParticipant && eventId) {
      const detailsArray = Object.entries(selectedParticipant.participant_details ?? {}).map(
        ([label, value]) => ({ label, value })
      );

      reset({
        id: selectedParticipant.id,
        event: eventId,
        participant_details: detailsArray,
      });

      replace(detailsArray);
    }
    else if (mode === "create participant" && eventId) {
      const emptyRow = [{ label: "", value: "" }];
      reset({
        id: undefined,
        event: eventId,
        participant_details: emptyRow,
      });
      replace(emptyRow);
    }
  }, [mode, selectedEvent, selectedParticipant, eventId, reset, replace]);



  const onSubmit = (data: CombinedForm) => {
    if (isParticipantMode) {
      const formData = data as ParticipantForm;

      const participantRecord: Record<string, string> = {};
      formData.participant_details?.forEach(({ label, value }) => {
        if (label) participantRecord[label] = value || "";
      });

      const payload = {
        id: formData.id ? String(formData.id) : undefined,
        event: eventId ?? "",
        participant_details: participantRecord,
      };

      if (mode === "edit participant") {
        updateParticipantMutation.mutate(payload as any, {
          onSuccess: () => {
            alert("Participant Updated Successfully")
            setSelectedParticipant(payload)
            setMode("show participant")
          }
        })
      } else {
        createParticipantMutation.mutate(payload as any, {
          onSuccess: () => {
            alert("Participant Created Successfully");
            setMode("show participant");
            reset();
          },
          onError: (err: any) => console.error(err),
        });
      }
    } else {
      const formData = data as EventForm;

      const detailsRecord: Record<string, string> = {};
      formData.details?.forEach(({ label, value }) => {
        if (label) detailsRecord[label] = value || "";
      });

      const payload = {
        ...formData,
        id: formData.id ? String(formData.id) : undefined,
        details: detailsRecord,
      };

      if (mode === "edit event") {
        updateEventMutation.mutate(payload as any, {
          onSuccess: () => {
            alert("Event Updated Successfully");
            setSelectedEvent(payload);
            setMode("show event");
          },
          onError: (err) => console.error(err),
        });
      } else {
        createEventMutation.mutate(payload as any, {
          onSuccess: () => {
            alert("Event Created Successfully");
            setSelectedEvent(payload);
            setMode("show event");
          },
          onError: (err) => console.error(err),
        });
      }
    }
  };

  return (
    <FormCard>
      <form
        className="flex flex-col h-[380px]"
        onSubmit={handleSubmit(onSubmit as any)}
      >
        <h2 className="text-xl font-bold mb-2">
          {
            mode === "edit event"
              ? "Edit Event"
              : mode === "create participant"
                ? "Create Participant"
                : mode === "edit participant"
                  ? "Edit Participant"
                  : mode === "show event"
                    ? "Show Event"
                    : mode === "show participant"
                      ? "Show Participant"
                      : mode === "create event"
                        ? "Create Event"
                        : ""
          }
        </h2>

        <div className="flex-1 overflow-y-auto p-2">
          {!isParticipantMode &&
            <Input
              type="text"
              placeholder="Title of the Event"
              {...register("event")}
              className="mb-1"
            />
          }
          {errors.event && (
            <p className="text-red-500 pl-1 text-[10px]">{errors.event.message}</p>
          )}
          {isParticipantMode &&
            <Input
              type="hidden"
              placeholder="Title of the Event"
              value={eventId}
              {...register("event")}
              className="mb-1"
            />
          }

          {fields.map((field, index) => {
            const fieldName = isParticipantMode ? "participant_details" : "details"
            return (
              <div key={field.id} className="flex items-center gap-2 mt-2 mb-3">
                <Input
                  type="text"
                  placeholder="Field Label"
                  {...register(`${fieldName}.${index}.label` as const)}
                  className="flex-1"
                />
                <Input
                  type="text"
                  placeholder="Field Value"
                  {...register(`${fieldName}.${index}.value` as const)}
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
            )
          })}
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
            {mode === "edit event" ? "Update" : "Submit"}
          </Button>
        </div>
      </form>
    </FormCard>
  );
}
