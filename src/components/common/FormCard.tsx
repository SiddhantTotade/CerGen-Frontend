import { X } from "lucide-react";
import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCardMode } from "@/hooks/useCardMode";

interface FormCardProps {
  children: ReactNode;
  className?: string;
}

export function FormCard({ children, className }: FormCardProps) {
  const { setMode } = useCardMode();

  return (
    <Card className={`relative w-90 h-[70vh] flex flex-col ${className || ""}`}>
      <Button
        className="absolute top-2 right-2 cursor-pointer"
        variant="ghost"
        size="icon"
        onClick={() => setMode("none")}
      >
        <X className="h-4 w-4" />
      </Button>

      <CardContent className="p-4">
        {children}
      </CardContent>
    </Card>
  );
}
