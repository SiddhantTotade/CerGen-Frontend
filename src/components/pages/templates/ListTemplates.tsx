import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { useFetchTemplates } from "@/hooks/useTemplates";
import { setSelectedTemplate } from "@/state/selectedTemplate";
import { setCardMode } from "@/state/cardMode";

export function ListTemplates() {
    const { data: templates, isLoading } = useFetchTemplates();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [emblaApi, setEmblaApi] = useState<any>(null);
    const [columns, setColumns] = useState(3);
    const navigate = useNavigate();

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

    const templateChunks = chunkArray(templates || [], columns * 3);

    useEffect(() => {
        if (!emblaApi) return;
        const handleSelect = () => setCurrentIndex(emblaApi.selectedScrollSnap());
        emblaApi.on("select", handleSelect);
        handleSelect();
        return () => emblaApi.off("select", handleSelect);
    }, [emblaApi]);

    if (isLoading) return <p>Loading events...</p>;
    if (!templates?.length) return <p>No events found.</p>;

    return (
        <Card className="w-[40%] flex justify-center">
            <CardContent>
                <Carousel opts={{ align: "start" }} setApi={setEmblaApi}>
                    <CarouselContent>
                        {templateChunks.map((chunk, pageIndex) => (
                            <CarouselItem key={pageIndex}>
                                <div
                                    className={`grid grid-rows-3 gap-4 p-2`}
                                    style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
                                >
                                    {chunk.map((template: any) => (
                                        <div
                                            className="flex flex-col gap-1"
                                            key={template.id || template.templateName}
                                        >
                                            <Card
                                                onClick={() => {
                                                    setSelectedTemplate(template);
                                                    setCardMode("edit template");
                                                    navigate({ to: `/app/${template.id}/template` });
                                                }}
                                                className="w-full cursor-pointer"
                                            >
                                                <CardContent>
                                                    <span className="font-semibold text-[12px]">
                                                        {template.templateName}
                                                    </span>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    ))}
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {currentIndex > 0 && (
                        <CarouselPrevious className="-left-5 cursor-pointer" />
                    )}
                    {currentIndex < templateChunks.length - 1 && (
                        <CarouselNext className="-right-5 cursor-pointer" />
                    )}
                </Carousel>
            </CardContent>
        </Card>
    );
}
