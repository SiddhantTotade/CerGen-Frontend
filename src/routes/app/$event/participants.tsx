import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/$event/participants")({
  component: RouteComponent,
});

function RouteComponent() {
  const { event } = Route.useParams()
  return <div>Hello "/app/participants"!</div>;
}
