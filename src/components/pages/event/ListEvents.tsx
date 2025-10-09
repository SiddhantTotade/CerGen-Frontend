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
  const navigate = useNavigate();

  useEffect(() => {
    if (!emblaApi) return;
    const handleSelect = () => setCurrentIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", handleSelect);
    handleSelect();
    return () => emblaApi.off("select", handleSelect);
  }, [emblaApi]);

  if (isLoading) return <p>Loading events...</p>;
  if (!events?.length) return <p>No events found.</p>;

  const chunkArray = <T,>(arr: T[], size: number): T[][] =>
    arr.reduce<T[][]>((acc, _, i) => {
      if (i % size === 0) acc.push(arr.slice(i, i + size));
      return acc;
    }, []);

  const eventChunks = chunkArray(events, 9);

  return (
    <Card className="w-[40%] flex justify-center">
      <CardContent>
        <Carousel opts={{ align: "start" }} setApi={setEmblaApi}>
          <CarouselContent>
            {eventChunks.map((chunk, pageIndex) => (
              <CarouselItem key={pageIndex}>
                <div className="p-2 grid grid-cols-3 gap-3">
                  {chunk.map((event: any, index: number) => (
                    <>
                      <Card
                        onClick={() =>
                          navigate({
                            to: `/app/${event.event}/participants`,
                            params: { event: event.event },
                          })
                        }
                        className="border w-full cursor-pointer"
                        key={index}
                      >
                        <CardContent className="flex flex-col items-center justify-center p-4">
                          <span className="font-semibold">{event.event}</span>

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
                        </CardContent>
                      </Card>
                    </>
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
