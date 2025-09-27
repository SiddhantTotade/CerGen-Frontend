import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function ListEvents() {
  return (
    <div className="border left-5 top-5 absolute">
      <Carousel
        opts={{
          align: "end",
        }}
        className="w-full max-w-sm relative"
      >
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-3xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="flex justify-end align-end mt-5">
          <CarouselPrevious className="relative right-10" />
          <CarouselNext className="relative right-5" />
        </div>
      </Carousel>
    </div>
  );
}
