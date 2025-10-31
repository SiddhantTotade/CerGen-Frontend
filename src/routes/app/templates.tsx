import { ListTemplates } from "@/components/pages/templates/ListTemplates";
import { Button } from "@/components/ui/button";
import { useCardMode } from "@/hooks/useCardMode";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/app/templates")({
  component: RouteComponent,
});

function RouteComponent() {
  const { setMode } = useCardMode();
  const navigate = useNavigate();

  return (
    <div>
      <Button
        className="cursor-pointer"
        onClick={() => {
          setMode("create template");
          navigate({ to: "/app/template/create" });
        }}
        size="sm"
      >
        <Plus />
      </Button>
      <ListTemplates />
    </div>
  );
}
