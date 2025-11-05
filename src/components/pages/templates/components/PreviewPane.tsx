import { CardContent } from "@/components/ui/card";

export default function PreviewPane({ srcDoc }: { srcDoc?: string }) {
  return (
    <CardContent className="p-0 h-[calc(100vh-80px)] overflow-hidden">
      <iframe
        srcDoc={srcDoc}
        title="Live HTML Preview"
        sandbox="allow-scripts allow-same-origin"
        className="w-full h-full bg-white"
      />
    </CardContent>
  );
}
