import { Card } from "@/components/ui/card";
import { Button } from "../ui/button";
import { useNavigate } from "@tanstack/react-router";
import { HomeIcon, LayoutTemplateIcon, UserRound } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useLogout } from "@/hooks/useLogout";

export function Navigation() {
  const navigate = useNavigate();
  const logout = useLogout();

  return (
    <Card
      className="p-2 flex flex-row w-[40%] justify-between items-center"
      id="custom_card"
    >
      <div className="flex text-white font-bold text-xl">
        <p>PaperLess</p>
      </div>
      <div className="gap-1 flex">
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

        <Popover>
          <Tooltip>
            <TooltipTrigger>
              <PopoverTrigger asChild>
                <Button
                  size="icon"
                  className="cursor-pointer bg-blue-500 hover:bg-blue-600"
                >
                  <UserRound />
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>

            <TooltipContent>Profile</TooltipContent>
          </Tooltip>

          <PopoverContent id="custom_card" className="w-40 p-1">
            <div className="flex flex-col gap-1">
              <Button
                onClick={() => navigate({ to: "/app/profile" })}
                className="justify-start bg-white cursor-pointer text-black hover:bg-gray-200"
              >
                Profile
              </Button>

              <Button
                onClick={() => {
                  logout.mutate();
                  navigate({ to: "/auth/login" });
                }}
                className="bg-red-500 hover:bg-red-600 justify-start cursor-pointer text-white"
              >
                Logout
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </Card>
  );
}
