import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function EventKeysSection({ eventKeys }: any) {
  return (
    <div className="flex w-full gap-2">
      <Card className="p-0 w-full">
        <p className="border-b pl-4 flex items-center">
          <small><b>Event Keys Reference</b></small>
        </p>
        <div className="flex flex-wrap gap-2 p-2">
          {eventKeys?.detailKeys?.map((e: string, i: number) => (
            <Badge key={i} variant="outline">{e}</Badge>
          ))}
        </div>
      </Card>
      <Card className="p-0 w-full">
        <p className="border-b pl-4 flex items-center">
          <small><b>Participant Keys Reference</b></small>
        </p>
        <div className="flex flex-wrap gap-2 p-2">
          {eventKeys?.participantDetailKeys?.map((e: string, i: number) => (
            <Badge key={i} variant="outline">{e}</Badge>
          ))}
        </div>
      </Card>
    </div>
  );
}
