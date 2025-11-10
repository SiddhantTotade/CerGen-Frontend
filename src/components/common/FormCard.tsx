import type { ReactNode } from "react";
import { PenSquare, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCardMode } from "@/hooks/useCardMode";
import { Card, CardContent } from "@/components/ui/card";
import { useSelectedEvent } from "@/hooks/useSelectedEvent";
import { TemplateDialog } from "./TemplateDialog";
import { useNavigate } from "@tanstack/react-router";

interface FormCardProps {
  children: ReactNode;
  className?: string;
}

export function FormCard({ children, className }: FormCardProps) {
  const { mode, setMode } = useCardMode();
  const { selectedEvent, setSelectedEvent } = useSelectedEvent();
  const navigate = useNavigate();

  return (
    <Card
      id="custom_card"
      className={`w-90 p-2 gap-1 text-white flex flex-col ${className || ""}`}
    >
      <div className="flex justify-between">
        <div className="flex gap-2">
          {mode !== "create event" && <TemplateDialog />}
          {mode !== "create event" && (
            <Button
              className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white hover:text-white"
              size="icon"
              onClick={() => {
                if (!selectedEvent) return;
                setMode(
                  mode === "show participant"
                    ? "edit participant"
                    : "edit event"
                );
                navigate({
                  to: "/app/$event/participants",
                  // @ts-ignore
                  params: { event: selectedEvent.id },
                });
              }}
            >
              <Users />
            </Button>
          )}
          {(mode === "show event" || mode === "show participant") && (
            <Button
              className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white hover:text-white"
              size="icon"
              onClick={() => {
                setMode(
                  mode === "show participant"
                    ? "edit participant"
                    : "edit event"
                );
              }}
            >
              <PenSquare />
            </Button>
          )}
        </div>
        <Button
          className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white hover:text-white"
          size="icon"
          onClick={() => {
            setMode("none");
            setSelectedEvent(null);
          }}
        >
          <X />
        </Button>
      </div>
      <CardContent className="p-1">{children}</CardContent>
    </Card>
  );
}
