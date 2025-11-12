export function base64ToPdf(
  fileName: string,
  base64String: string
): void {
  const date = new Date().toISOString().split("T")[0];
  const fullFileName = `${fileName}-${date}.pdf`;

  const base64WithoutPrefix = base64String.replace(
    /^data:application\/pdf;base64,/,
    ""
  );

  try {
    const binary = atob(base64WithoutPrefix);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    const blob = new Blob([bytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fullFileName;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error converting Base64 to PDF:", error);
  }
}
