import { createFileRoute } from "@tanstack/react-router";

import { useCardMode } from "@/hooks/useCardMode";
import { Profile } from "@/components/common/Profile";
import { FieldBuilder } from "@/components/common/FieldBuilder";
import { ListEvents } from "@/components/pages/event/ListEvents";
import { SelectedEventDetails } from "@/components/pages/event/SelectedEventDetails";

export const Route = createFileRoute("/app/events")({
  component: EventPage,
});

function EventPage() {
  const { mode } = useCardMode();

  return (
    <div className="flex justify-center m-5 gap-5">
      <Profile />
      <ListEvents />
      {(mode === "create event" || mode === "edit event") && <FieldBuilder />}
      {mode === "show event" && <SelectedEventDetails />}
    </div>
  );
}
