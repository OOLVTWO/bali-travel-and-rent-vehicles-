export type PlannerStop = {
  id: string;
  name: string;
  /** Perkiraan jam berkendara pulang-pergi dari Canggu (kasar) */
  rideHours: number;
  /** Tour yang paling cocok untuk stop ini */
  tourSlug: string;
};

export const plannerStops: PlannerStop[] = [
  { id: "ubud", name: "Ubud", rideHours: 2, tourSlug: "ubud-highlights" },
  { id: "tegallalang", name: "Tegallalang", rideHours: 2.5, tourSlug: "ubud-highlights" },
  { id: "tirta-empul", name: "Tirta Empul", rideHours: 3, tourSlug: "ubud-highlights" },
  { id: "kintamani", name: "Kintamani", rideHours: 4, tourSlug: "mount-batur-sunrise" },
  { id: "bedugul", name: "Bedugul", rideHours: 3.5, tourSlug: "bedugul-lake-temple" },
  { id: "uluwatu", name: "Uluwatu", rideHours: 2, tourSlug: "uluwatu-sunset-kecak" },
];
