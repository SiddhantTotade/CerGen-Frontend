import React from "react";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { parseFile } from "@/utils/fileParser";

export const Route = createFileRoute("/app/event_details")({
  component: RouteComponent,
});

function RouteComponent() {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [jsonData, setJsonData] = React.useState<any[]>([]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      const json = await parseFile(file);
      setJsonData(json);
    } catch (err: any) {
      return toast(err);
    }
  };

  return (
    <div>
      <DataTable />
      <Input
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        id="password"
        type="file"
      />

      <Button
        onClick={() => fileInputRef.current?.click()}
        type="submit"
        className="cursor-pointer"
      >
        <Upload />
      </Button>
      {JSON.stringify(jsonData, null, 2)}
    </div>
  );
}
