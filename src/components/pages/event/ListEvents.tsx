import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useCardMode } from "@/hooks/useCardMode";
import { useDeleteEvent, useFetchEvents } from "@/hooks/useEvents";
import { useSelectedEvent } from "@/hooks/useSelectedEvent";
import { formatToISOWithTZ } from "@/utils/dateTimeConverter";
import { Trash2 } from "lucide-react";

export function ListEvents() {
  const { data: events, isLoading } = useFetchEvents();
  const { setSelectedEvent } = useSelectedEvent();
  const { mode, setMode } = useCardMode();
  const deleteEvent = useDeleteEvent();

  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  if (isLoading) return <p>Loading events...</p>;
  if (!events?.length) return <p>No events found.</p>;

  const allSelected = selectedRows.length === events.length;

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedRows([]);
    } else {
      setSelectedRows(events.map((event: any) => Number(event.id)));
    }
  };

  const handleRowSelect = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDeleteAll = () => {
    deleteEvent.mutate(selectedRows);
  };

  const handleDeleteRow = (id: number) => {
    deleteEvent.mutate([id]);
  };

  return (
    <Card id="custom_card" className="w-[40%] flex justify-center">
      <CardContent>
        <div className="p-2 flex justify-between items-center">
          <p className="text-lg text-white font-bold">Events</p>

          <div className="flex gap-2">
            {mode === "none" && !allSelected && (
              <Button
                className="cursor-pointer text-sm bg-blue-500 hover:bg-blue-600"
                onClick={() => setMode("create event")}
                size="sm"
              >
                Create Event
              </Button>
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
                    onClick={(e) => e.stopPropagation()}
                    onCheckedChange={handleSelectAll}
                    className="border-gray-500 data-[state=checked]:bg-blue-500"
                  />
                </th>
                <th className="text-left text-sm text-white p-2">Event Name</th>
                <th className="text-left text-sm text-white p-2">Created on</th>
                <th className="text-left text-sm text-white p-2">Updated on</th>
                <th className="text-left text-sm text-white p-2 w-20"></th>
              </tr>
            </thead>

            <tbody>
              {events.map((event: any) => {
                const id = Number(event.id);
                const isSelected = selectedRows.includes(id);

                return (
                  <tr
                    key={id}
                    onClick={() => {
                      setMode("show event");
                      setSelectedEvent(event);
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

                    <td className="text-white p-2">{event.event}</td>
                    <td className="text-white p-2">
                      {formatToISOWithTZ(event.createdAt)}
                    </td>
                    <td className="text-white p-2">
                      {formatToISOWithTZ(event.updatedAt)}
                    </td>

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
