import { currency, percent, compact } from "@/lib/client/formatters"

function expect(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg)
}

export function run() {
  const c = currency(123456)
  expect(/123/.test(c), "currency formats number")
  const p = percent(0.123)
  expect(p.includes("%"), "percent adds %")
  const k = compact(15320)
  expect(/[kK]/.test(k), "compact has K")
}
