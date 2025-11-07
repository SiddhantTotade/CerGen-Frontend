import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { setCardMode } from "@/state/cardMode";
import { Button } from "@/components/ui/button";
import { useCardMode } from "@/hooks/useCardMode";
import { useFetchEvents } from "@/hooks/useEvents";
import { useNavigate } from "@tanstack/react-router";
import { useSelectedEvent } from "@/hooks/useSelectedEvent";
import { ArrowRight } from "lucide-react";
import { formatToISOWithTZ } from "@/utils/dateTimeConverter";

export function ListEvents() {
  const { data: events, isLoading } = useFetchEvents();
  const { setSelectedEvent } = useSelectedEvent();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [emblaApi, setEmblaApi] = useState<any>(null);
  const [columns, setColumns] = useState(3);
  const navigate = useNavigate();
  const { mode, setMode } = useCardMode();

  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth >= 1024) setColumns(3);
      else if (window.innerWidth >= 640) setColumns(2);
      else setColumns(1);
    };
    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  const chunkArray = <T,>(arr: T[], size: number): T[][] =>
    arr.reduce<T[][]>((acc, _, i) => {
      if (i % size === 0) acc.push(arr.slice(i, i + size));
      return acc;
    }, []);

  const eventChunks = chunkArray(events || [], columns * 3);

  useEffect(() => {
    if (!emblaApi) return;
    const handleSelect = () => setCurrentIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", handleSelect);
    handleSelect();
    return () => emblaApi.off("select", handleSelect);
  }, [emblaApi]);

  if (isLoading) return <p>Loading events...</p>;
  if (!events?.length) return <p>No events found.</p>;

  return (
    <Card id="custom_card" className="w-[50%] flex justify-center">
      <CardContent>
        <div className="border-b pl-3 pb-2 flex justify-between items-center">
          <p className="text-lg text-white font-bold">Events</p>
          {mode === "none" && (
            <Button
              className="cursor-pointer text-sm bg-blue-500 hover:bg-blue-600"
              onClick={() => setMode("create event")}
              size="sm"
            >
              Create Event
            </Button>
          )}
        </div>
        <Carousel opts={{ align: "start" }} setApi={setEmblaApi}>
          <CarouselContent>
            {eventChunks.map((chunk, pageIndex) => (
              <CarouselItem key={pageIndex}>
                <div
                  className={`grid grid-rows-3 gap-4 p-2`}
                  style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
                >
                  {chunk.map((event: any) => (
                    <div
                      className="flex flex-col gap-1"
                      key={event.id || event.event}
                    >
                      <Card
                        onClick={() =>
                          navigate({ to: `/app/${event.id}/participants` })
                        }
                        className="w-full p-1 cursor-pointer bg-stone-800"
                      >
                        <CardContent className="p-1 flex flex-col">
                          <span className="font-semibold text-lg text-white">
                            {event.event}
                          </span>
                          <div>
                            <small className="font-semibold text-xs text-white">
                              {formatToISOWithTZ(event.createdAt)}
                            </small>
                          </div>
                        </CardContent>
                      </Card>
                      <Button
                        onClick={() => {
                          setCardMode("show event");
                          setSelectedEvent(event);
                        }}
                        className="cursor-pointer text-[10px] text-white"
                        variant="link"
                      >
                        View Details <ArrowRight />
                      </Button>
                    </div>
                  ))}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {currentIndex > 0 && (
            <CarouselPrevious className="-left-5 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white hover:text-white" />
          )}
          {currentIndex < eventChunks.length - 1 && (
            <CarouselNext className="-right-5 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white hover:text-white" />
          )}
        </Carousel>
      </CardContent>
    </Card>
  );
}
