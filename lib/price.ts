const rubleFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
});

export const formatKopecks = (kopecks: number): string =>
  rubleFormatter.format(kopecks / 100);

export const isValidPriceInput = (value: string): boolean =>
  /^\d*(?:[.,]\d{0,2})?$/.test(value);
