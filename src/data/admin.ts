// DATA CONTOH untuk panel admin. Nanti diganti data dari database (Supabase).

export type BookingStatus = "menunggu-dp" | "konfirmasi" | "dikonfirmasi" | "berjalan" | "selesai" | "batal";

export const bookingStatusLabel: Record<BookingStatus, string> = {
  "menunggu-dp": "Menunggu DP",
  konfirmasi: "Perlu konfirmasi",
  dikonfirmasi: "Dikonfirmasi",
  berjalan: "Berjalan",
  selesai: "Selesai",
  batal: "Batal",
};

export type Booking = {
  code: string;
  guest: string;
  country: string;
  item: string;
  kind: "Rental" | "Tour" | "Charter" | "Transfer" | "Paket";
  dates: string;
  total: number;
  status: BookingStatus;
  channel: "Website" | "WhatsApp" | "Instagram";
};

export const kpis = {
  bookingsToday: 12,
  bookingsDelta: 3,
  revenueMonth: 86_400_000,
  revenueTarget: 120_000_000,
  unitsOut: 27,
  unitsTotal: 35,
  needsAction: 5,
  urgent: 2,
};

export const scheduleDays = ["Sen 28", "Sel 29", "Rab 30", "Kam 1", "Jum 2", "Sab 3", "Min 4"];

export type ScheduleBlock = { start: number; end: number; kind: "rental" | "tour" | "servis"; label: string };
export type ScheduleRow = { unit: string; plate: string; blocks: ScheduleBlock[] };

// start/end = index hari (0 = Senin), end eksklusif
export const schedule: ScheduleRow[] = [
  { unit: "Scoopy", plate: "DK 3512 AB", blocks: [
    { start: 0, end: 3, kind: "rental", label: "BK-1018" },
    { start: 3, end: 4, kind: "servis", label: "Servis" },
    { start: 4, end: 7, kind: "rental", label: "BK-1033" },
  ] },
  { unit: "Scoopy", plate: "DK 4471 FC", blocks: [{ start: 0, end: 7, kind: "rental", label: "BK-0977 · sewa bulanan" }] },
  { unit: "NMAX", plate: "DK 2208 KB", blocks: [{ start: 1, end: 4, kind: "rental", label: "BK-1021" }] },
  { unit: "NMAX", plate: "DK 6630 AD", blocks: [{ start: 2, end: 6, kind: "rental", label: "BK-1030" }] },
  { unit: "Avanza", plate: "DK 1187 PP", blocks: [
    { start: 0, end: 2, kind: "rental", label: "BK-1015" },
    { start: 2, end: 3, kind: "tour", label: "Ubud" },
    { start: 4, end: 6, kind: "tour", label: "Charter" },
  ] },
  { unit: "Avanza", plate: "DK 1902 QA", blocks: [
    { start: 0, end: 1, kind: "tour", label: "Airport" },
    { start: 1, end: 5, kind: "rental", label: "BK-1024" },
  ] },
  { unit: "Innova", plate: "DK 1450 ZZ", blocks: [
    { start: 0, end: 1, kind: "tour", label: "Batur" },
    { start: 1, end: 2, kind: "tour", label: "Charter" },
    { start: 2, end: 3, kind: "servis", label: "Servis" },
    { start: 3, end: 7, kind: "tour", label: "BK-1029 · Family 4D3N" },
  ] },
  { unit: "Innova", plate: "DK 1777 BB", blocks: [
    { start: 0, end: 2, kind: "tour", label: "Charter Ubud" },
    { start: 3, end: 4, kind: "tour", label: "Airport" },
    { start: 5, end: 6, kind: "tour", label: "Uluwatu" },
  ] },
];

export type ActionItem = { title: string; detail: string; level: "bad" | "warn" | "info" | "neutral"; label: string };

export const actionItems: ActionItem[] = [
  { title: "BK-1026 · Jemput bandara", detail: "Hari ini 14:30 · Ngurah Rai · 3 tamu", level: "bad", label: "Butuh driver" },
  { title: "BK-1035 · Nusa Penida", detail: "Booking dari website · Kam 1 Okt · 2 orang", level: "bad", label: "Konfirmasi" },
  { title: "BK-1031 · Scoopy 3 hari", detail: "Link bayar dikirim 3 jam lalu", level: "warn", label: "Menunggu DP" },
  { title: "BK-1029 · Family 4D3N", detail: "Minta mundur 1 hari · cek Innova DK 1450 ZZ", level: "info", label: "Ganti tanggal" },
  { title: "Avanza DK 1187 PP", detail: "Servis 10.000 km jatuh tempo minggu ini", level: "neutral", label: "Servis" },
];

export const revenueByService = [
  { label: "Rental motor & mobil", value: 31_200_000 },
  { label: "Paket tour", value: 24_800_000 },
  { label: "Mobil + driver", value: 18_100_000 },
  { label: "Airport transfer", value: 7_600_000 },
  { label: "Paket hemat", value: 4_700_000 },
];

export const handovers = [
  { time: "08:00", booking: "BK-1018 · Antar", unit: "Scoopy DK 3512 AB", place: "Canggu", level: "info" as const, label: "Selesai" },
  { time: "09:30", booking: "BK-1015 · Antar", unit: "Avanza DK 1187 PP", place: "Seminyak", level: "warn" as const, label: "Di jalan" },
  { time: "14:30", booking: "BK-1026 · Jemput", unit: "Avanza DK 1902 QA", place: "Bandara", level: "bad" as const, label: "Butuh driver" },
  { time: "17:00", booking: "BK-1002 · Ambil", unit: "NMAX DK 2208 KB", place: "Ubud", level: "neutral" as const, label: "Terjadwal" },
];

export const bookings: Booking[] = [
  { code: "BK-1035", guest: "Sophie M.", country: "Australia", item: "Nusa Penida West Island Tour", kind: "Tour", dates: "1 Okt", total: 1_900_000, status: "konfirmasi", channel: "Website" },
  { code: "BK-1033", guest: "Daniel K.", country: "Germany", item: "Honda Scoopy · 3 hari", kind: "Rental", dates: "2–4 Okt", total: 270_000, status: "dikonfirmasi", channel: "WhatsApp" },
  { code: "BK-1031", guest: "Priya S.", country: "India", item: "Honda Scoopy · 3 hari", kind: "Rental", dates: "1–3 Okt", total: 270_000, status: "menunggu-dp", channel: "Website" },
  { code: "BK-1030", guest: "Tom H.", country: "UK", item: "Yamaha NMAX · 4 hari", kind: "Rental", dates: "30 Sep–3 Okt", total: 600_000, status: "dikonfirmasi", channel: "Instagram" },
  { code: "BK-1029", guest: "Keluarga Wijaya", country: "Indonesia", item: "Family Bali 4D3N", kind: "Paket", dates: "1–4 Okt", total: 3_200_000, status: "dikonfirmasi", channel: "WhatsApp" },
  { code: "BK-1026", guest: "Emma W.", country: "Netherlands", item: "Airport pick-up", kind: "Transfer", dates: "28 Sep", total: 250_000, status: "konfirmasi", channel: "Website" },
  { code: "BK-1024", guest: "Lukas M.", country: "Austria", item: "Toyota Avanza · 4 hari", kind: "Rental", dates: "29 Sep–2 Okt", total: 1_400_000, status: "berjalan", channel: "WhatsApp" },
  { code: "BK-1021", guest: "Mia R.", country: "USA", item: "Yamaha NMAX · 3 hari", kind: "Rental", dates: "29 Sep–1 Okt", total: 450_000, status: "berjalan", channel: "Website" },
  { code: "BK-1018", guest: "Chen L.", country: "Singapore", item: "Honda Scoopy · 3 hari", kind: "Rental", dates: "28–30 Sep", total: 270_000, status: "berjalan", channel: "Website" },
  { code: "BK-1015", guest: "Anna P.", country: "France", item: "Toyota Avanza · 2 hari", kind: "Rental", dates: "28–29 Sep", total: 700_000, status: "berjalan", channel: "WhatsApp" },
  { code: "BK-1002", guest: "Oliver B.", country: "Canada", item: "Yamaha NMAX · 7 hari", kind: "Rental", dates: "21–28 Sep", total: 1_050_000, status: "selesai", channel: "Website" },
  { code: "BK-0998", guest: "Hana T.", country: "Japan", item: "Mount Batur Sunrise Trek", kind: "Tour", dates: "25 Sep", total: 1_300_000, status: "batal", channel: "Website" },
];

export const fleetUnits = [
  { plate: "DK 3512 AB", model: "Honda Scoopy", kind: "Motor", status: "Disewa", nextService: "2 Okt", km: 18_240 },
  { plate: "DK 4471 FC", model: "Honda Scoopy", kind: "Motor", status: "Disewa", nextService: "15 Okt", km: 9_870 },
  { plate: "DK 2208 KB", model: "Yamaha NMAX", kind: "Motor", status: "Tersedia", nextService: "20 Okt", km: 12_050 },
  { plate: "DK 6630 AD", model: "Yamaha NMAX", kind: "Motor", status: "Tersedia", nextService: "8 Nov", km: 6_410 },
  { plate: "DK 1187 PP", model: "Toyota Avanza", kind: "Mobil", status: "Disewa", nextService: "30 Sep", km: 49_600 },
  { plate: "DK 1902 QA", model: "Toyota Avanza", kind: "Mobil", status: "Tour", nextService: "22 Okt", km: 31_220 },
  { plate: "DK 1450 ZZ", model: "Toyota Innova Zenix", kind: "Mobil", status: "Tour", nextService: "30 Sep", km: 27_900 },
  { plate: "DK 1777 BB", model: "Toyota Innova Zenix", kind: "Mobil", status: "Tour", nextService: "12 Nov", km: 15_300 },
];
