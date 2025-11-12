export function base64ToPdf(base64Data: string, fileName: string) {
  try {
    // Remove the Base64 prefix if present
    const cleanedBase64 = base64Data.replace(/^data:application\/pdf;base64,/, "").trim();

    // Decode base64 string to binary
    const byteCharacters = atob(cleanedBase64);

    // Convert binary string to Uint8Array
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // Create a Blob with PDF type
    const blob = new Blob([byteArray], { type: "application/pdf" });

    // Create a temporary link and trigger the download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);

    // Add file name with current date if not provided
    const dateStr = new Date().toLocaleDateString("en-GB").replace(/\//g, "");
    link.download = `${fileName}-${dateStr}.pdf`;

    link.click();
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error("Error converting Base64 to PDF:", error);
  }
}
