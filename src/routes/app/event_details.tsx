import React from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { createFileRoute } from "@tanstack/react-router";
import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/app/event_details")({
  component: RouteComponent,
});

function RouteComponent() {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      console.log("Selected File", files);
    }
  };

  return (
    <div>
      <DataTable />
      <Input
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        id="password"
        type="file"
      />

      <Button
        onClick={handleUploadClick}
        type="submit"
        className="cursor-pointer"
      >
        <Upload />
      </Button>
    </div>
  );
}
