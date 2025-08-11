export const currency = (n: number, currency: string = "INR") =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(n)

export const percent = (n: number, opts: Intl.NumberFormatOptions = {}) =>
  new Intl.NumberFormat(undefined, {
    style: "percent",
    maximumFractionDigits: 1,
    ...opts,
  }).format(n)

export const compact = (n: number) =>
  new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 }).format(n)
