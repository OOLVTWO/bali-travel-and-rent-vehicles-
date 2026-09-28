const idr = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 });

/** 90000 -> "Rp 90.000" */
export function rupiah(value: number) {
  return `Rp ${idr.format(value)}`;
}

/** 86400000 -> "Rp 86,4 jt" (buat dashboard admin) */
export function rupiahShort(value: number) {
  if (value >= 1_000_000) {
    const jt = value / 1_000_000;
    return `Rp ${jt.toLocaleString("id-ID", { maximumFractionDigits: 1 })} jt`;
  }
  return rupiah(value);
}
