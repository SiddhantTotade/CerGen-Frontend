import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function EventKeysSection({ eventKeys }: any) {
  return (
    <div className="flex w-full gap-2">
      <Card id="custom_card" className="p-0 rounded-sm w-1/2 text-white gap-0">
        <p className="border-b p-2 flex items-center">
          <small><b>Event Keys Reference</b></small>
        </p>
        <div className="flex gap-2 p-2 overflow-x-auto">
          {eventKeys?.detailKeys?.map((e: string, i: number) => (
            <Badge className="border-blue-500 flex item-center text-white" key={i} variant="outline">{e}</Badge>
          ))}
        </div>
      </Card>
      <Card id="custom_card" className="p-0 w-1/2 rounded-sm text-white gap-0">
        <p className="border-b p-2 flex items-center">
          <small><b>Participant Keys Reference</b></small>
        </p>
        <div className="flex gap-2 p-2 overflow-x-auto">
          {eventKeys?.participantDetailKeys?.map((e: string, i: number) => (
            <Badge className="border-blue-500 flex item-center text-white" key={i} variant="outline">{e}</Badge>
          ))}
        </div>
      </Card>
    </div>
  );
}
