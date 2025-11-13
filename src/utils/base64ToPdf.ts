export function base64ToPdf(base64Data: string, fileName: string) {
  try {
    const cleanedBase64 = base64Data.replace(/^data:application\/pdf;base64,/, "").trim();

    const byteCharacters = atob(cleanedBase64);

    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], { type: "application/pdf" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);

    const dateStr = new Date().toLocaleDateString("en-GB").replace(/\//g, "");
    link.download = `${fileName}-${dateStr}.pdf`;

    link.click();
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error("Error converting Base64 to PDF:", error);
  }
}
