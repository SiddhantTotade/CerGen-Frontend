export function formatToISOWithTZ(inputDate: string | number | Date): string {
    const date = new Date(inputDate);
    if (isNaN(date.getTime())) {
        throw new Error("Invalid date input");
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}
