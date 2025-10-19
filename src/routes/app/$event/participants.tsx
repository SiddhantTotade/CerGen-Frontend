import { Plus } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";

import { FieldBuilder } from "@/components/common/FieldBuilder";
import { ListParticipants } from "@/components/pages/participants/ListParticipants";
import { SelectedParticipantDetails } from "@/components/pages/participants/SelectedParticipantDetails";
import { Button } from "@/components/ui/button";
import { useCardMode } from "@/hooks/useCardMode";

export const Route = createFileRoute("/app/$event/participants")({
  component: RouteComponent,
});

function RouteComponent() {
  const { mode, setMode } = useCardMode()

  return (
    <div className="flex justify-center m-5">
      <ListParticipants />
      {mode === "none" && (
        <Button
          className="cursor-pointer"
          onClick={() => setMode("create")}
          size="icon"
        >
          <Plus />
        </Button>
      )}
      {(mode === "create" || mode === "edit") && <FieldBuilder />}

      {mode === "show" && <SelectedParticipantDetails />}
    </div>
  )
}
