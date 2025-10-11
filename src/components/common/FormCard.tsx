import { X } from "lucide-react";
import { PenSquare } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { useCardMode } from "@/hooks/useCardMode";
import { Card, CardContent } from "@/components/ui/card";
import { useSelectedEvent } from "@/hooks/useSelectedEvent";

interface FormCardProps {
  children: ReactNode;
  className?: string;
}

export function FormCard({ children, className }: FormCardProps) {
  const { mode, setMode } = useCardMode();
  const { setSelectedEvent } = useSelectedEvent();

  return (
    <Card className={`relative w-90 flex flex-col ${className || ""}`}>
      <Button
        className="absolute top-2 right-2 cursor-pointer"
        variant="ghost"
        size="icon"
        onClick={() => {
          setMode("none");
          setSelectedEvent(null);
        }}
      >
        <X />
      </Button>
      {mode === "show" &&
        <Button
          className="absolute top-2 right-12 cursor-pointer"
          variant="ghost"
          size="icon"
          onClick={() => {
            setMode("edit");
            setSelectedEvent(null);
          }}
        >
          <PenSquare />
        </Button>
      }
      <CardContent className="p-4">{children}</CardContent>
    </Card>
  );
}
