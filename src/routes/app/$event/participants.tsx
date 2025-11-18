import { createFileRoute, useParams } from "@tanstack/react-router";

import { useCardMode } from "@/hooks/useCardMode";
import { FieldBuilder } from "@/components/common/FieldBuilder";
import { ListParticipants } from "@/components/pages/participants/ListParticipants";
import { SelectedParticipantDetails } from "@/components/pages/participants/SelectedParticipantDetails";
import { AppCard } from "@/components/common/AppCard";
import { Navigation } from "@/components/common/Navigation";

export const Route = createFileRoute("/app/$event/participants")({
  component: RouteComponent,
});

function RouteComponent() {
  const { mode } = useCardMode();
  const { event: eventId } = useParams({ from: "/app/$event/participants" });

  return (
    <AppCard>
      <div className="w-full flex flex-col justify-center m-5 gap-5">
        <div className="flex justify-center">
          <Navigation />
        </div>
        <div className="flex justify-center gap-5">
          <ListParticipants />
          {(mode === "create participant" || mode === "edit participant") && (
            <FieldBuilder eventId={eventId} />
          )}
          {mode === "show participant" && <SelectedParticipantDetails />}
        </div>
      </div>
    </AppCard>
  );
}
