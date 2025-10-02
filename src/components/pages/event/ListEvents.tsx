import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useFetchEvents } from "@/hooks/useEvents";

export function ListEvents() {
  const { data: events, isLoading } = useFetchEvents();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [emblaApi, setEmblaApi] = useState<any>(null);

  useEffect(() => {
    if (!emblaApi) return;
    const handleSelect = () => setCurrentIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", handleSelect);
    handleSelect();
    return () => emblaApi.off("select", handleSelect);
  }, [emblaApi]);

  if (isLoading) return <p>Loading events...</p>;
  if (!events?.length) return <p>No events found.</p>;

  // Split events into chunks of 9
  const chunkArray = <T,>(arr: T[], size: number): T[][] =>
    arr.reduce<T[][]>((acc, _, i) => {
      if (i % size === 0) acc.push(arr.slice(i, i + size));
      return acc;
    }, []);

  const eventChunks = chunkArray(events, 9);

  return (
    <Card className="w-[40%] h-[55vh]">
      <CardContent>
        <Carousel opts={{ align: "start" }} setApi={setEmblaApi}>
          <CarouselContent>
            {eventChunks.map((chunk, pageIndex) => (
              <CarouselItem key={pageIndex}>
                <div className="p-2 grid grid-cols-3 gap-3">
                  {chunk.map((event: any, index: number) => (
                    <Card className="border w-full cursor-pointer" key={index}>
                      <CardContent className="flex items-center justify-center p-4">
                        <span className="font-semibold">{event.event}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {currentIndex > 0 && <CarouselPrevious className="-left-5 cursor-pointer" />}
          {currentIndex < eventChunks.length - 1 && (
            <CarouselNext className="-right-5 cursor-pointer" />
          )}
        </Carousel>
      </CardContent>
    </Card>
  );
}
