import { createFileRoute } from "@tanstack/react-router";
import { Navigation } from "@/components/common/Navigation";
import { ListTemplates } from "@/components/pages/templates/ListTemplates";
import { AppCard } from "@/components/common/AppCard";

export const Route = createFileRoute("/app/templates")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AppCard>
      <div className="w-full flex flex-col justify-center m-5 gap-5">
        <div className="flex justify-center">
          <Navigation />
        </div>
        <div className="flex justify-center">
          <ListTemplates />
        </div>
      </div>
    </AppCard>
  );
}
