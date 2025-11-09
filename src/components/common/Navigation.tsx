import { Card } from "@/components/ui/card";
import { Button } from "../ui/button";
import { useNavigate } from "@tanstack/react-router";
import { HomeIcon, LayoutTemplateIcon } from "lucide-react";

export function Navigation() {
  const navigate = useNavigate();

  return (
    <Card
      className="p-2 flex flex-row w-[40%] justify-between items-center"
      id="custom_card"
    >
      <div className="flex text-white font-bold text-xl">
        <p>PaperLess</p>
      </div>
      <div className="gap-2 flex">
        <Button
          className="cursor-pointer bg-blue-500 hover:bg-blue-600"
          size="icon"
        >
          <HomeIcon />
        </Button>
        <Button
          size="icon"
          onClick={() => navigate({ to: "/app/templates" })}
          className="cursor-pointer bg-blue-500 hover:bg-blue-600"
        >
          <LayoutTemplateIcon />
        </Button>
      </div>
    </Card>
  );
}
