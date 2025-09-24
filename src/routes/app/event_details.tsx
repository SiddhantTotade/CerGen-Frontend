import { DataTable } from "@/components/ui/data-table";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/event_details")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <DataTable />
    </div>
  );
}
