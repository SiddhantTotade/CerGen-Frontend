import { Plus } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { useCardMode } from "@/hooks/useCardMode";
import { Profile } from "@/components/common/Profile";
import { FieldBuilder } from "@/components/common/FieldBuilder";
import { ListEvents } from "@/components/pages/event/ListEvents";
import { SelectedEventDetails } from "@/components/pages/event/SelectedEventDetails";

export const Route = createFileRoute("/app/events")({
  component: EventPage,
});

function EventPage() {
  const { mode, setMode } = useCardMode();

  return (
    <div className="flex justify-center m-5 gap-5">
      <Profile />
      <ListEvents />
      {mode === "none" && (
        <Button
          className="cursor-pointer"
          onClick={() => setMode("create")}
          size="sm"
        >
          <Plus size="sm" />
        </Button>
      )}
      {mode === "create" && <FieldBuilder />}
      {mode === "show" && <SelectedEventDetails />}
    </div>
  );
}
