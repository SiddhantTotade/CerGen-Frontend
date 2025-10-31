import { HTMLEditor } from "@/components/pages/templates/HTMLEditor";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/template/create")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <HTMLEditor />
    </div>
  );
}
