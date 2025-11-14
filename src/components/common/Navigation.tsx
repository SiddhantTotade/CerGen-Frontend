import { Card } from "@/components/ui/card";
import { Button } from "../ui/button";
import { useNavigate } from "@tanstack/react-router";
import { HomeIcon, LayoutTemplateIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

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
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              onClick={() => navigate({ to: "/app/events" })}
              className="cursor-pointer bg-blue-500 hover:bg-blue-600"
            >
              <HomeIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Home</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              onClick={() => navigate({ to: "/app/templates" })}
              className="cursor-pointer bg-blue-500 hover:bg-blue-600"
            >
              <LayoutTemplateIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Templates</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </Card>
  );
}
