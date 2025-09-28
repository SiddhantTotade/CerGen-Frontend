import { createFileRoute } from "@tanstack/react-router";

import { ListEvents } from "@/components/pages/event/ListEvents";
import { Profile } from "@/components/common/Profile";
import { FieldBuilder } from "@/components/common/FieldBuilder";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app/events")({
  component: EventPage,
});

function EventPage() {
  const [open, isOpen] = useState(false)

  return (
    <div className="flex justify-center m-5 gap-5">
      <Profile />
      <ListEvents />
      <Button className="absolute right-10" onClick={() => isOpen(!open)}>+</Button>
      {open ?
        <div className={`w-100 -z-1 h-40
        transform transition-transform duration-500
        ${open ? "translate-x-0" : "-translate-x-full"}`}>
          <FieldBuilder />
        </div>
        : ""}
    </div>
  );
}
