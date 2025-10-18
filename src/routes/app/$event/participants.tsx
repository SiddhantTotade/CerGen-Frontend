import { ListParticipants } from "@/components/pages/participants/ListParticipants";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/$event/participants")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex justify-center m-5 gap-5">
      <ListParticipants />
    </div>
  )
}
