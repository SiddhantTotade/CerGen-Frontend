import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useFetchTemplates } from "@/hooks/useTemplates";
import { useCardMode } from "@/hooks/useCardMode";
import { formatToISOWithTZ } from "@/utils/dateTimeConverter";
import { setSelectedTemplate } from "@/state/selectedTemplate";
import { setCardMode } from "@/state/cardMode";
import { Trash2 } from "lucide-react";

export function ListTemplates() {
  const { data: templates, isLoading } = useFetchTemplates();
  const { mode, setMode } = useCardMode();
  const navigate = useNavigate();

  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  if (isLoading) return <p>Loading templates...</p>;
  if (!templates?.length) return <p>No templates found.</p>;

  const allSelected = selectedRows.length === templates.length;

  const handleSelectAll = () => {
    if (allSelected) setSelectedRows([]);
    else setSelectedRows(templates.map((_, i) => i.toString()));
  };

  const handleRowSelect = (i: number) => {
    const key = i.toString();
    setSelectedRows((prev) =>
      prev.includes(key)
        ? prev.filter((id) => id !== key)
        : [...prev, key]
    );
  };

  const handleDeleteAll = () => {
    alert("Delete all selected templates!");
  };

  const handleDeleteRow = (i: number) => {
    alert(`Delete template ${i}`);
  };

  return (
    <Card id="custom_card" className="w-[40%] flex justify-center">
      <CardContent>
        <div className="p-2 flex justify-between items-center">
          <p className="text-lg text-white font-bold">Templates</p>
          <div className="flex gap-2">
            {mode === "none" && (
              <Button
                className="cursor-pointer text-sm bg-blue-500 hover:bg-blue-600"
                onClick={() => {
                  setMode("create template");
                  navigate({ to: "/app/template/create" });
                }}
                size="sm"
              >
                Create Template
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
                    onCheckedChange={handleSelectAll}
                    className="border-gray-500 data-[state=checked]:bg-blue-500"
                  />
                </th>
                <th className="text-left text-white p-2">Template Name</th>
                <th className="text-left text-white p-2">Created on</th>
                <th className="text-left text-white p-2">Updated on</th>
                <th className="text-left text-white p-2 w-20"></th>
              </tr>
            </thead>
            <tbody>
              {templates.map((template, i) => {
                const isSelected = selectedRows.includes(i.toString());
                return (
                  <tr
                    key={i}
                    className={`border-t text-sm ${isSelected ? "bg-gray-800" : "hover:bg-gray-700"
                      }`}
                  >
                    <td className="p-2 w-8 align-middle">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleRowSelect(i)}
                        className="border-gray-500 data-[state=checked]:bg-blue-500"
                      />
                    </td>
                    {/* @ts-ignore */}
                    <td className="text-white p-2 cursor-pointer" onClick={() => { setSelectedTemplate(template); setCardMode("edit template"); navigate({ to: `/app/${template.id}/template` }); }}>{template.templateName}</td>
                    {/* @ts-ignore */}
                    <td className="text-white p-2">{formatToISOWithTZ(template.createdAt)}</td>
                    {/* @ts-ignore */}
                    <td className="text-white p-2">{formatToISOWithTZ(template.updatedAt)}</td>
                    <td className="text-white p-2 text-center">
                      {isSelected && (
                        <Button
                          size="icon"
                          className="bg-red-500 hover:bg-red-600 text-xs"
                          onClick={() => handleDeleteRow(i)}
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
