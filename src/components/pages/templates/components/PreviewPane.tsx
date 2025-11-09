import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useRef, useState } from "react";
import { ZoomIn, ZoomOut, RefreshCw } from "lucide-react";

export default function PreviewPane({ srcDoc }: { srcDoc?: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.3));
  const handleReset = () => setZoom(1);

  const htmlWithInjectedStyle = useMemo(() => {
    const htmlContent =
      // @ts-ignore
      typeof srcDoc === "object" && srcDoc?.htmlContent
        // @ts-ignore
        ? srcDoc.htmlContent
        : srcDoc || "";

    const injectedStyle = `
      <style>
      </style>
    `;

    if (htmlContent.includes("</head>")) {
      return htmlContent.replace("</head>", `${injectedStyle}</head>`);
    } else {
      return `${injectedStyle}${htmlContent}`;
    }
  }, [srcDoc]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    iframe.onload = () => {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) return;

      const body = iframeDoc.body;
      const contentWidth = body.scrollWidth;
      const containerWidth = iframe.clientWidth;

      if (contentWidth > containerWidth) {
        const fitScale = containerWidth / contentWidth;
        setZoom(parseFloat(fitScale.toFixed(2)));
      }
    };
  }, [srcDoc]);

  return (
    <CardContent className="relative p-4 bg-gray-100 h-[500px] w-1/2 overflow-hidden rounded-lg">
      <div className="absolute top-2 right-2 z-10 flex gap-1 p-1 rounded-md" id="custom_card">
        <Button className="text-black hover:text-black hover:bg-gray-200 bg-white cursor-pointer" size="icon" onClick={handleZoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button className="text-black hover:text-black hover:bg-gray-200 bg-white cursor-pointer" size="icon" onClick={handleZoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button className="text-black hover:text-black hover:bg-gray-200 bg-white cursor-pointer" size="icon" onClick={handleReset}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-full h-full overflow-auto bg-white rounded-lg flex justify-center items-start">
        <iframe
          ref={iframeRef}
          srcDoc={htmlWithInjectedStyle}
          title="Live HTML Preview"
          sandbox="allow-scripts allow-same-origin"
          className="border-0 w-full h-full"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "top center",
            transition: "transform 0.2s ease",
          }}
        />
      </div>
    </CardContent>
  );
}
