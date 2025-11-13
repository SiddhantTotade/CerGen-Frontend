import { zipSync } from "fflate";

export function base64ToPdf(
  base64Data: string | string[],
  fileName: string,
  mode: "single" | "zip" = "single"
) {
  try {
    const dateStr = new Date().toLocaleDateString("en-GB").replace(/\//g, "");

    // SINGLE PDF
    if (mode === "single" && typeof base64Data === "string") {
      const cleanedBase64 = base64Data
        .replace(/^data:application\/pdf;base64,/, "")
        .trim();

      const byteChars = atob(cleanedBase64);
      const byteArray = new Uint8Array(byteChars.length);
      for (let i = 0; i < byteChars.length; i++) {
        byteArray[i] = byteChars.charCodeAt(i);
      }

      const blob = new Blob([byteArray], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${fileName}-${dateStr}.pdf`;
      link.click();
      URL.revokeObjectURL(link.href);
      return;
    }

    // ZIP MODE
    if (mode === "zip" && Array.isArray(base64Data)) {
      const files: Record<string, Uint8Array> = {};

      base64Data.forEach((b64, index) => {
        const cleaned = b64.replace(/^data:application\/pdf;base64,/, "").trim();
        const byteChars = atob(cleaned);
        const bytes = new Uint8Array(byteChars.length);
        for (let i = 0; i < byteChars.length; i++) {
          bytes[i] = byteChars.charCodeAt(i);
        }
        files[`${fileName}_${index + 1}.pdf`] = bytes;
      });

      const zipped = zipSync(files, { level: 9 });
      // @ts-ignore
      const blob = new Blob([zipped], { type: "application/zip" });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${fileName}-${dateStr}.zip`;
      link.click();
      URL.revokeObjectURL(link.href);
      return;
    }

    console.error("Invalid base64ToPdf input or mode.");
  } catch (error) {
    console.error("Error converting Base64 to PDF/ZIP:", error);
  }
}
