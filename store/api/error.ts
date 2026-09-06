export function getApiErrorMessage(error: unknown, fallback = "Не удалось выполнить запрос"): string {
  if (typeof error !== "object" || error === null || !("data" in error)) return fallback;
  const data = error.data;
  return typeof data === "object" && data !== null && "error" in data && typeof data.error === "string"
    ? data.error
    : fallback;
}
