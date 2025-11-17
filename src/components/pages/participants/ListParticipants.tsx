import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useParams } from "@tanstack/react-router";
import { useFetchParticipants, useDeleteParticipant } from "@/hooks/useParticipants";
import { useCardMode } from "@/hooks/useCardMode";
import { useSelectedParticipant } from "@/hooks/useSelectedParticipant";
import { TemplateDialog } from "@/components/common/TemplateDialog";
import { Trash2 } from "lucide-react";

export function ListParticipants() {
  const { event } = useParams({ from: "/app/$event/participants" });
  const { data: participants, isLoading } = useFetchParticipants(event ?? "");
  const deleteParticipant = useDeleteParticipant();
  const { mode, setMode } = useCardMode();
  const { setSelectedParticipant } = useSelectedParticipant();

  const [localParticipants, setLocalParticipants] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  useEffect(() => {
    if (participants) {
      setLocalParticipants(
        participants.map((p) => ({
          ...p,
          participant_details:
            typeof p.participant_details === "string"
              ? JSON.parse(p.participant_details)
              : p.participant_details || {},
        }))
      );
    }
  }, [participants]);

  const detailKeys = Array.from(
    new Set(localParticipants.flatMap((p) => Object.keys(p.participant_details || {})))
  );

  const allSelected = selectedRows.length === localParticipants.length;

  const handleSelectAll = () => {
    if (allSelected) setSelectedRows([]);
    else setSelectedRows(localParticipants.map((p) => Number(p.id)));
  };

  const handleRowSelect = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDeleteAll = () => {
    deleteParticipant.mutate(selectedRows, {
      onSuccess: () => {
        setLocalParticipants((prev) =>
          prev.filter((p) => !selectedRows.includes(Number(p.id)))
        );
        setSelectedRows([]);
      },
    });
  };

  const handleDeleteRow = (id: number) => {
    deleteParticipant.mutate([id], {
      onSuccess: () => {
        setLocalParticipants((prev) => prev.filter((p) => Number(p.id) !== id));
        setSelectedRows((prev) => prev.filter((x) => x !== id));
      },
    });
  };

  const eventName = localParticipants[0]?.event?.event || "Event";

  if (!localParticipants.length) {
    return (
      <Card id="custom_card" className="w-[40%] flex justify-center">
        <CardContent className="w-full text-center p-4 flex flex-col gap-4">
          <p className="text-gray-400 text-lg">No participants found</p>
          <div className="flex justify-center gap-2">
            <Button
              className="bg-blue-500 cursor-pointer hover:bg-blue-600"
              onClick={() => setMode("create participant")}
              size="sm"
            >
              Create Participant
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card id="custom_card" className="w-[40%] flex justify-center">
      <CardContent>
        <div className="p-2 flex justify-between items-center">
          <p className="text-lg text-white font-bold">{eventName} | Participants</p>
          <div className="flex gap-2">
            {mode === "none" && !allSelected && (
              <>
                <Button
                  className="cursor-pointer text-sm bg-blue-500 hover:bg-blue-600"
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
              <tr className="text-sm">
                <th className="p-2 w-8 text-left">
                  <Checkbox
                    checked={allSelected}
                    onClick={(e) => e.stopPropagation()}
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
              {localParticipants.map((p) => {
                const id = Number(p.id);
                const isSelected = selectedRows.includes(id);

                return (
                  <tr
                    key={id}
                    onClick={() => {
                      setMode("show participant");
                      setSelectedParticipant(p);
                    }}
                    className={`cursor-pointer border-t text-xs ${isSelected ? "bg-gray-800" : "hover:bg-gray-700"
                      }`}
                  >
                    <td className="p-2 w-8 align-middle">
                      <Checkbox
                        checked={isSelected}
                        onClick={(e) => e.stopPropagation()}
                        onCheckedChange={() => handleRowSelect(id)}
                        className="border-gray-500 data-[state=checked]:bg-blue-500"
                      />
                    </td>

                    {detailKeys.map((key) => (
                      <td key={key} className="text-white p-2">
                        {p.participant_details?.[key] ?? "-"}
                      </td>
                    ))}

                    <td className="text-white p-2 text-center">
                      {isSelected && (
                        <Button
                          size="icon"
                          className="bg-red-500 hover:bg-red-600 text-xs cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteRow(id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
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
