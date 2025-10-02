import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCardMode } from "@/hooks/useCardMode";
import { X } from "lucide-react";

interface FormCardProps {
    children: ReactNode;
    className?: string;
}

export function FormCard({ children, className }: FormCardProps) {
    const { setMode } = useCardMode()

    return (
        <Card className={`${className || ""}`}>
            <div className="relative">
                <Button
                    className="absolute cursor-pointer -top-3.5 right-2"
                    variant="ghost"
                    size="sm"
                    onClick={() => setMode("none")}
                >
                    <X size="sm" />
                </Button>
            </div>
            <CardContent>{children}</CardContent>
        </Card>
    );
}
