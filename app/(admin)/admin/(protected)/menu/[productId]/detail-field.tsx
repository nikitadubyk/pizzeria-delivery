import type { DetailFieldProps } from "./types";

export function DetailField({ label, value }: DetailFieldProps) {
  return (
    <div className="gap-xs grid min-w-0">
      <dt className="text-muted text-sm">{label}</dt>
      <dd className="text-text m-0 min-w-0 text-sm font-semibold break-words">
        {value === null || value === "" ? "Не указано" : value}
      </dd>
    </div>
  );
}
