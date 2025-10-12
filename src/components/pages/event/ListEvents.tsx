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
import { useFetchEvents } from "@/hooks/useEvents";
import { useNavigate } from "@tanstack/react-router";
import { useSelectedEvent } from "@/hooks/useSelectedEvent";

export function ListEvents() {
  const { data: events, isLoading } = useFetchEvents();
  const { setSelectedEvent } = useSelectedEvent();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [emblaApi, setEmblaApi] = useState<any>(null);
  const [columns, setColumns] = useState(3); // default 3 columns
  const navigate = useNavigate();

  // Adjust columns based on window width
  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth >= 1024) setColumns(3); // desktop
      else if (window.innerWidth >= 640) setColumns(2); // tablet
      else setColumns(1); // mobile
    };
    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  // Chunk events dynamically based on columns * 3 rows
  const chunkArray = <T,>(arr: T[], size: number): T[][] =>
    arr.reduce<T[][]>((acc, _, i) => {
      if (i % size === 0) acc.push(arr.slice(i, i + size));
      return acc;
    }, []);

  const eventChunks = chunkArray(events || [], columns * 3); // 3 rows per page

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
    <Card className="w-[50%] flex justify-center">
      <CardContent>
        <Carousel opts={{ align: "start" }} setApi={setEmblaApi}>
          <CarouselContent>
            {eventChunks.map((chunk, pageIndex) => (
              <CarouselItem key={pageIndex}>
                <div
                  className={`grid grid-rows-3 gap-4`}
                  style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
                >
                  {chunk.map((event: any) => (
                    <div key={event.id || event.event}>
                      <Card
                        onClick={() =>
                          navigate({
                            to: `/app/${event.event}/participants`,
                            params: { event: event.event },
                          })
                        }
                        className="w-full cursor-pointer"
                      >
                        <CardContent>
                          <span className="font-semibold text-[12px]">
                            {event.event}
                          </span>
                        </CardContent>
                      </Card>
                      <Button
                        onClick={() => {
                          setCardMode("show");
                          setSelectedEvent(event);
                        }}
                        className="cursor-pointer text-[10px]"
                        variant="link"
                      >
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {currentIndex > 0 && (
            <CarouselPrevious className="-left-5 cursor-pointer" />
          )}
          {currentIndex < eventChunks.length - 1 && (
            <CarouselNext className="-right-5 cursor-pointer" />
          )}
        </Carousel>
      </CardContent>
    </Card>
  );
}
