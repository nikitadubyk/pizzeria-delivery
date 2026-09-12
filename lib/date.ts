import dayjs, { type ConfigType } from "dayjs";
import "dayjs/locale/ru";

export function formatDateTime(value: ConfigType) {
  return dayjs(value).locale("ru").format("D MMM YYYY г., HH:mm");
}
