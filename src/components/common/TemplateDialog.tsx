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
import PreviewPane from "../pages/templates/components/PreviewPane";
import React from "react";

export function TemplateDialog() {
    const { data: templates } = useFetchTemplates();
    const [selectedTemplate, setSelectedTemplate] = React.useState<any>(null);

    return (
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    <Button
                        size="icon"
                        className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white hover:text-white"
                    >
                        <ScrollText />
                    </Button>
                </DialogTrigger>

                <DialogContent id="custom_card" className="text-white max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Event Template</DialogTitle>
                        <DialogDescription className="text-stone-400">
                            Preview your template here.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4">
                        <SearchableSelect
                            shouldFetchKeys={false}
                            items={templates as any}
                            labelKey="templateName"
                            idKey="id"
                            onSelectItem={setSelectedTemplate}
                        />

                        {selectedTemplate ? (
                            <PreviewPane srcDoc={selectedTemplate} />
                        ) : (
                            <div className="text-gray-400 text-sm italic">
                                Select a template to preview
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
                            className="bg-blue-500 hover:bg-blue-600 cursor-pointer"
                            type="submit"
                        >
                            Save changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
}
