import type { DetailFieldProps } from "./types";

export function DetailField({ label, value }: DetailFieldProps) {
  return (
    <div className="grid min-w-0 gap-xs">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="m-0 min-w-0 break-words text-sm font-semibold text-text">
        {value === null || value === "" ? "Не указано" : value}
      </dd>
    </div>
  );
}
