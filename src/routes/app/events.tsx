import { createFileRoute } from "@tanstack/react-router";

import { useCardMode } from "@/hooks/useCardMode";
import { FieldBuilder } from "@/components/common/FieldBuilder";
import { ListEvents } from "@/components/pages/event/ListEvents";
import { SelectedEventDetails } from "@/components/pages/event/SelectedEventDetails";
import { Navigation } from "@/components/common/Navigation";
import { AppCard } from "@/components/common/AppCard";

export const Route = createFileRoute("/app/events")({
  component: EventPage,
});

function EventPage() {
  const { mode } = useCardMode();

  return (
    <AppCard>
      <div className="w-full flex flex-col justify-center m-5 gap-5">
        <div className="flex justify-center">
          <Navigation />
        </div>
        <div className="flex justify-center gap-5">
          <ListEvents />
          {(mode === "create event" || mode === "edit event") && <FieldBuilder />}
          {mode === "show event" && <SelectedEventDetails />}
        </div>
      </div>
    </AppCard>
  );
}
