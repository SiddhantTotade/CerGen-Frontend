import { Card } from "@/components/ui/card";
import { useParams } from "@tanstack/react-router";

import { useFetchParticipants } from "@/hooks/useParticipants";
import { PanelLeftOpen, PenSquare, Trash2 } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

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

    const getAllKeys = (data: any[]) => {
        const keys = new Set<string>();
        data.forEach((item) => {
            Object.keys(item.participant_details || {}).forEach((key) => keys.add(key));
        });
        return Array.from(keys);
    };

    const detailKeys = getAllKeys(participants);

    return (
        <div className="flex w-[50%] gap-3 justify-center">
            <Card className="w-[60%] mx-auto p-1 m-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {detailKeys.map((key) => (
                                <TableHead key={key}>{key}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {participants.map((p) => (
                            <TableRow key={p.id}>
                                {detailKeys.map((key) => (
                                    <TableCell key={key}>
                                        {p.participant_details?.[key] ?? "-"}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={detailKeys.length + 2}>Total Participants : {participants.length}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </Card>
            <Card className="p-1 m-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center" colSpan={3}>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="border-b-1">
                        {participants.map((p) => (
                            <TableRow key={p.id}>
                                <TableCell>
                                    <PanelLeftOpen className="cursor-pointer text-blue-500" size="20" />
                                </TableCell>
                                <TableCell>
                                    <PenSquare className="cursor-pointer" size="20" />
                                </TableCell>
                                <TableCell>
                                    <Trash2 className="cursor-pointer text-red-500" size="20" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
