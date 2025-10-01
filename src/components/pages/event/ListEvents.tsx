import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { useFetchEvents } from "@/hooks/useEvents";

export function ListEvents() {
  const { data: events, isLoading } = useFetchEvents();
  const items = Array.from({ length: 30 });

  console.log("Data", events);

  const chunkArray = <T,>(arr: T[], size: number): T[][] =>
    arr.reduce<T[][]>((acc, _, i) => {
      if (i % size === 0) acc.push(arr.slice(i, i + size));
      return acc;
    }, []);

  const chunks = chunkArray(items, 9);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [emblaApi, setEmblaApi] = useState<any>(null);

  useEffect(() => {
    if (!emblaApi) return;

    const handleSelect = () => {
      const index = emblaApi.selectedScrollSnap();
      console.log("Current Slide Index:", index);
      setCurrentIndex(index);
    };

    emblaApi.on("select", handleSelect);

    handleSelect();

    return () => {
      emblaApi.off("select", handleSelect);
    };
  }, [emblaApi]);

  return (
    <Card>
      <CardContent>
        <Carousel opts={{ align: "end" }} setApi={setEmblaApi}>
          <CarouselContent>
            {events?.map((chunk, pageIndex) => (
              <CarouselItem key={pageIndex}>
                <div className="p-2 grid grid-cols-3 gap-3">
                  {events?.map((_, index) => (
                    <Card key={index}>
                      <CardContent className="flex items-center justify-center p-2">
                        <span className="font-semibold">
                          {pageIndex * 9 + index + 1}
                        </span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {currentIndex > 0 && <CarouselPrevious className="-left-5" />}
          {currentIndex < chunks.length - 1 && (
            <CarouselNext className="-right-5" />
          )}
        </Carousel>
      </CardContent>
    </Card>
  );
}
