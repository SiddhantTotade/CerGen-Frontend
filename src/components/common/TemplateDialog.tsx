import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollText } from "lucide-react";
import { SearchableSelect } from "./SearchableSelect";
import { useFetchTemplates } from "@/hooks/useTemplates";
import { useGenerateEventTemplate } from "@/hooks/useGenerateTemplate";
import PreviewPane from "../pages/templates/components/PreviewPane";
import { getSelectedEvent } from "@/state/selectedEvents";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function TemplateDialog() {
  const { data: templates } = useFetchTemplates();
  const [selectedTemplate, setSelectedTemplate] = React.useState<any>(null);
  const [orientation, setOrientation] = React.useState<string>("");
  const [previewHtml, setPreviewHtml] = React.useState<string>("");
  const event = getSelectedEvent();

  const { mutateAsync: generateTemplate, isPending } = useGenerateEventTemplate();

  // 👇 Button handler (not form submit)
  const handleGenerate = async () => {
    if (!selectedTemplate?.id || !orientation) {
      alert("Please select both template and orientation!");
      return;
    }

    try {
      const payload = {
        event_id: event?.id || "",
        template_id: selectedTemplate.id,
        orientation,
      };

      console.log("Payload:", payload);

      const res = await generateTemplate(payload);

      console.log("Response:", res);

      if (res.success) {
        // setPreviewHtml(res.data);
      } else {
        alert("Failed: " + res.message);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while generating template!");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white hover:text-white"
        >
          <ScrollText />
        </Button>
      </DialogTrigger>

      <DialogContent id="custom_card" className="text-white">
        <DialogHeader>
          <DialogTitle>Event Template</DialogTitle>
          <DialogDescription className="text-stone-400">
            Preview your template here.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="flex items-center gap-3">
            <SearchableSelect
              shouldFetchKeys={false}
              items={templates as any}
              labelKey="templateName"
              idKey="id"
              label="Select Template"
              value={selectedTemplate?.id}
              onSelectItem={setSelectedTemplate}
            />

            <Select onValueChange={setOrientation} value={orientation}>
              <SelectTrigger
                style={{ height: "40px" }}
                className="w-full text-white border-white"
              >
                <SelectValue placeholder="Select Orientation" />
              </SelectTrigger>
              <SelectContent
                id="custom_card"
                className="text-white bg-gray-900 border-gray-700"
              >
                <SelectGroup>
                  <SelectItem value="portrait" className="text-white">
                    Portrait
                  </SelectItem>
                  <SelectItem value="landscape" className="text-white">
                    Landscape
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {previewHtml ? (
            <PreviewPane srcDoc={previewHtml} />
          ) : (
            <div className="text-gray-400 text-sm italic">
              Select a template and orientation to preview
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button className="text-black bg-white hover:bg-gray-200 cursor-pointer">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            className="bg-blue-500 hover:bg-blue-600 cursor-pointer"
            onClick={handleGenerate}
            disabled={isPending}
          >
            {isPending ? "Generating..." : "Generate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
