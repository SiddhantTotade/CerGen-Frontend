import { useState, useEffect } from "react";
import { setCardMode } from "@/state/cardMode";
import { useMatch, useParams } from "@tanstack/react-router";
import TemplateForm from "./components/TemplateForm";
import PreviewPane from "./components/PreviewPane";

export function HTMLEditor() {
  const isEditRoute = useMatch({
    from: "/app/$template/template",
    shouldThrow: false,
  });

  let templateId: string | undefined;
  if (isEditRoute) {
    const params = useParams({ from: "/app/$template/template" });
    templateId = params.template;
  }

  const isEditMode = Boolean(templateId);

  useEffect(() => {
    setCardMode(isEditMode ? "edit template" : "create template");
  }, [isEditMode]);

  const [srcDoc, setSrcDoc] = useState("<h1>paperLess 📄</h1>");

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <TemplateForm
        templateId={templateId}
        isEditMode={isEditMode}
        onPreviewChange={setSrcDoc}
      />
      <PreviewPane srcDoc={srcDoc} />
    </div>
  );
}
