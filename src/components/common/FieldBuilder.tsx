import { useState } from "react";
import { useForm } from "react-hook-form";
import { Trash2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormCard } from "./FormCard";
import { eventSchema, type EventForm } from "@/schemas/app";

export function FieldBuilder() {
  const [title, setTitle] = useState("");
  const [fields, setFields] = useState([{ label: "", value: "" }]);

  const { handleSubmit } = useForm<EventForm>({
    resolver: zodResolver(eventSchema),
  });

  const handleFieldChange = (
    index: number,
    key: "label" | "value",
    newValue: string
  ) => {
    const newFields = [...fields];
    newFields[index][key] = newValue;
    setFields(newFields);
  };

  const addField = () => setFields([...fields, { label: "", value: "" }]);
  const removeField = (index: number) =>
    setFields(fields.filter((_, i) => i !== index));

  const onSubmit = () => {
    const details: Record<string, string> = {};
    fields.forEach((f) => {
      if (f.label) details[f.label] = f.value || "";
    });

    console.log({
      event: title || "Untitled Event",
      details,
    });

    setTitle("");
    setFields([{ label: "", value: "" }]);
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-3"
          />

          {fields.map((field, index) => (
            <div key={index} className="flex items-center gap-2 mb-3">
              <Input
                type="text"
                placeholder="Field Label"
                value={field.label}
                onChange={(e) =>
                  handleFieldChange(index, "label", e.target.value)
                }
                className="flex-1"
              />
              <Input
                type="text"
                placeholder="Field Value"
                value={field.value}
                onChange={(e) =>
                  handleFieldChange(index, "value", e.target.value)
                }
                className="flex-1"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeField(index)}
                disabled={fields.length === 1}
              >
                <Trash2 size="sm" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex justify-between pt-3 border-t">
          <Button size="sm" type="button" variant="outline" onClick={addField}>
            <Plus className="w-4 h-4 mr-2" /> Add Field
          </Button>
          <Button size="sm" type="submit">
            Submit
          </Button>
        </div>
      </form>
    </FormCard>
  );
}
