import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useParams } from "@tanstack/react-router";
import { useFetchParticipants } from "@/hooks/useParticipants";
import { setCardMode } from "@/state/cardMode";
import { setSelectedParticipant } from "@/state/selectedParticipant";
import { useCardMode } from "@/hooks/useCardMode";
import { TemplateDialog } from "@/components/common/TemplateDialog";

export function ListParticipants() {
  const { event } = useParams({ from: "/app/$event/participants" });
  const { data: participants, isLoading } = useFetchParticipants(event ?? "");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const { mode, setMode } = useCardMode();

  if (isLoading) return <p>Loading participants...</p>;
  if (!participants?.length)
    return (
      <Card className="w-[40%] p-4 text-center text-gray-500">
        No participants found
      </Card>
    );
  // @ts-ignore
  const eventName = participants[0]?.event?.event || "Event";

  const parsedParticipants = participants.map((p) => ({
    ...p,
    participant_details:
      // @ts-ignore
      typeof p.participantDetails === "string"
        ? // @ts-ignore
          JSON.parse(p.participantDetails)
        : p.participant_details || {},
  }));

  const getAllKeys = (data: any[]) => {
    const keys = new Set<string>();
    data.forEach((item) => {
      Object.keys(item.participant_details || {}).forEach((key) =>
        keys.add(key)
      );
    });
    return Array.from(keys);
  };

  const detailKeys = getAllKeys(parsedParticipants);
  const allSelected = selectedRows.length === parsedParticipants.length;

  const handleSelectAll = () => {
    if (allSelected) setSelectedRows([]);
    else setSelectedRows(parsedParticipants.map((_, i) => i.toString()));
  };

  const handleRowSelect = (i: number) => {
    const key = i.toString();
    setSelectedRows((prev) =>
      prev.includes(key) ? prev.filter((id) => id !== key) : [...prev, key]
    );
  };

  const handleDeleteAll = () => {
    alert("Delete all selected participants!");
  };

  const handleDeleteRow = (i: number) => {
    alert(`Delete participant ${i + 1}`);
  };

  return (
    <Card id="custom_card" className="w-[40%] flex justify-center">
      <CardContent className="w-full">
        <div className="p-2 flex justify-between items-center">
          <p className="text-lg text-white font-bold">
            {eventName} | Participants
          </p>
          <div className="flex items-center gap-2">
            {mode === "none" && !allSelected && (
              <>
                <Button
                  className="cursor-pointer bg-blue-500 hover:bg-blue-600"
                  onClick={() => setMode("create participant")}
                  size="sm"
                >
                  Create Participant
                </Button>
                <TemplateDialog label="Generate" />
              </>
            )}

            {allSelected && (
              <Button
                className="cursor-pointer text-sm bg-red-500 hover:bg-red-600"
                onClick={handleDeleteAll}
                size="sm"
              >
                Delete All
              </Button>
            )}
          </div>
        </div>

        <div className="h-[45vh] overflow-y-auto relative">
          <table className="w-full border-collapse">
            <thead className="bg-gray-900 sticky top-0 z-10">
              <tr>
                <th className="p-2 w-8 text-left">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={handleSelectAll}
                    className="border-gray-500 data-[state=checked]:bg-blue-500"
                  />
                </th>
                {detailKeys.map((key) => (
                  <th key={key} className="text-left text-white p-2 capitalize">
                    {key}
                  </th>
                ))}
                <th className="text-left text-white p-2 w-20"></th>
              </tr>
            </thead>

            <tbody>
              {parsedParticipants.map((p, i) => {
                const isSelected = selectedRows.includes(i.toString());
                return (
                  <tr
                    key={p.id}
                    className={`border-t text-sm ${
                      isSelected ? "bg-gray-800" : "hover:bg-gray-700"
                    }`}
                  >
                    <td className="p-2 w-8 align-middle">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleRowSelect(i)}
                        className="border-gray-500 data-[state=checked]:bg-blue-500"
                      />
                    </td>

                    {detailKeys.map((key) => (
                      <td
                        key={key}
                        className="text-white p-2 cursor-pointer"
                        onClick={() => {
                          setCardMode("show participant");
                          setSelectedParticipant(p);
                        }}
                      >
                        {p.participant_details?.[key] ?? "-"}
                      </td>
                    ))}

                    <td className="text-white p-2 text-center">
                      {isSelected && (
                        <Button
                          size="sm"
                          className="bg-red-500 hover:bg-red-600 text-xs"
                          onClick={() => handleDeleteRow(i)}
                        >
                          Delete
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
