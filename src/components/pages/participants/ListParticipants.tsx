import { Card } from "@/components/ui/card";
import { useParams } from "@tanstack/react-router";

import { useFetchParticipants } from "@/hooks/useParticipants";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { setCardMode } from "@/state/cardMode";
import { setSelectedParticipant } from "@/state/selectedParticipant";

export function ListParticipants() {
    const { event } = useParams({ from: "/app/$event/participants" });
    const { data: participants } = useFetchParticipants(event ?? "");

    if (!participants || participants.length === 0) {
        return (
            <Card className="w-[40%] p-4 text-center text-gray-500">
                No participants found
            </Card>
        );
    }

    const parsedParticipants = participants.map((p) => ({
        ...p,
        participant_details: p.participant_details || {}
    }));

    const getAllKeys = (data: any[]) => {
        const keys = new Set<string>();
        data.forEach((item) => {
            Object.keys(item.participant_details || {}).forEach((key) => keys.add(key));
        });
        return Array.from(keys);
    };

    const detailKeys = getAllKeys(parsedParticipants);

    return (
        <Card className="w-[60%] mx-auto p-1 m-0">
            <Table>
                <TableHeader>
                    <TableRow>
                        {detailKeys.map((key) => (
                            <TableHead className="text-center" key={key}>
                                {key}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {parsedParticipants.map((p) => (
                        <TableRow key={p.id}>
                            {detailKeys.map((key) => (
                                <TableCell
                                    onClick={() => {
                                        setCardMode("show participant");
                                        setSelectedParticipant(p);
                                    }}
                                    className="text-center cursor-pointer"
                                    key={key}
                                >
                                    {p.participant_details?.[key] ?? "-"}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
}
