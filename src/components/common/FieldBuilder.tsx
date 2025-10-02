import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card } from "../ui/card";

import { Trash2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { eventSchema, type EventForm } from "@/schemas/app";
import { FormCard } from "./FormCard";

export function FieldBuilder() {
  const [fields, setFields] = useState([{ label: "", type: "text" }]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventForm>({
    resolver: zodResolver(eventSchema),
  });

  const handleFieldChange = (
    index: number,
    key: "label" | "type",
    value: string
  ) => {
    const newFields = [...fields];
    newFields[index][key] = value;
    setFields(newFields);
  };

  const addField = () => {
    setFields([...fields, { label: "", type: "text" }]);
  };

  const removeField = (index: number) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
  };

  return (
    <FormCard>
      <div className="mx-auto">
        <h2 className="text-xl font-bold mb-2">Create Fields</h2>
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
            <Select
              value={field.type}
              onValueChange={(value: any) =>
                handleFieldChange(index, "type", value)
              }
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="password">Password</SelectItem>
                <SelectItem value="checkbox">Checkbox</SelectItem>
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => removeField(index)}
              disabled={fields.length === 1}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}

        <div className="flex justify-between mt-4">
          <Button type="button" variant="outline" onClick={addField}>
            <Plus className="w-4 h-4 mr-2" /> Add Field
          </Button>
          <Button type="button" onClick={() => handleSubmit}>
            Submit
          </Button>
        </div>
      </div>
    </FormCard>
  );
}
