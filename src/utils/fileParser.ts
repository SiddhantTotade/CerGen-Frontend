import * as XLSX from "xlsx";

export type JSONData = Record<string, any>[];

export async function parseFile(file: File): Promise<JSONData> {
  const fileExt = file.name.split(".").pop()?.toLowerCase();
  const reader = new FileReader();

  return new Promise<JSONData>((resolve, reject) => {
    reader.onload = (e) => {
      const data = e.target?.result;
      if (!data) {
        return reject(new Error("No data found in file"));
      }

      try {
        if (fileExt === "xls" || fileExt === "xlsx") {
          // Convert Excel sheet to JSON
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];

          const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, {
            defval: null, // Ensure empty cells are included with null values
          });

          resolve(jsonData);
        } else if (fileExt === "json") {
          // Directly parse JSON file
          const parsedData = JSON.parse(data as string);

          // Ensure it's always an array of objects
          if (Array.isArray(parsedData)) {
            resolve(parsedData as JSONData);
          } else {
            reject(new Error("Invalid JSON format: Root element must be an array"));
          }
        } else {
          reject(new Error("Unsupported file type. Please upload XLS, XLSX, or JSON"));
        }
      } catch (err) {
        reject(err instanceof Error ? err : new Error(String(err)));
      }
    };

    // Choose appropriate reading method
    if (fileExt === "xls" || fileExt === "xlsx") {
      reader.readAsArrayBuffer(file);
    } else if (fileExt === "json") {
      reader.readAsText(file);
    } else {
      reject(new Error("Unsupported file type"));
    }
  });
}
