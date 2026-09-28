"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { tourCategories } from "@/data/tours";
import { bookingMessage, waLink } from "@/lib/whatsapp";
import { Calendar, Compass, MapPin, Plane, Scooter, Search, Steering } from "@/components/icons";

type Tab = "rent" | "tours" | "driver" | "airport";

const tabs: { id: Tab; label: string; short: string; Icon: typeof Scooter }[] = [
  { id: "rent", label: "Rent a vehicle", short: "Rent", Icon: Scooter },
  { id: "tours", label: "Tours & activities", short: "Tours", Icon: Compass },
  { id: "driver", label: "Car with driver", short: "Driver", Icon: Steering },
  { id: "airport", label: "Airport transfer", short: "Airport", Icon: Plane },
];

export function SearchBox() {
  const router = useRouter();
  const id = useId();
  const [tab, setTab] = useState<Tab>("rent");
  const [type, setType] = useState("scooter");
  const [area, setArea] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [category, setCategory] = useState("");
  const [hours, setHours] = useState("10");
  const [direction, setDirection] = useState("From the airport");
  const [pax, setPax] = useState("2");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (tab === "rent") {
      const q = new URLSearchParams({ type });
      if (from) q.set("from", from);
      if (to) q.set("to", to);
      if (area) q.set("area", area);
      router.push(`/rentals?${q.toString()}`);
    } else if (tab === "tours") {
      router.push(category ? `/tours?category=${category}` : "/tours");
    } else if (tab === "driver") {
      const msg = bookingMessage("Car with driver", [["Date", from], ["Hours", hours], ["Pick-up", area], ["Travellers", pax]]);
      window.open(waLink(msg), "_blank", "noopener,noreferrer");
    } else {
      const msg = bookingMessage("Airport transfer", [["Direction", direction], ["Date", from], ["Hotel or villa", area], ["Travellers", pax]]);
      window.open(waLink(msg), "_blank", "noopener,noreferrer");
    }
  }

  const fieldBox = "flex flex-col gap-1.5 px-1 lg:px-5 lg:border-r lg:border-line-soft";
  const fieldLabel = "text-xs font-bold tracking-[0.08em] text-muted uppercase";
  const input = "h-10 w-full rounded-lg border border-line bg-white px-2.5 text-[16px] font-semibold text-ink lg:h-8 lg:border-0 lg:px-0";

  return (
    <form onSubmit={onSubmit} className="rounded-[22px] bg-white text-ink shadow-[0_24px_60px_rgb(6_28_42/0.28)]">
      <div role="tablist" aria-label="What are you looking for?" className="grid grid-cols-4 border-b border-line-soft px-2 lg:flex lg:gap-2 lg:px-5">
        {tabs.map(({ id: t, label, short, Icon }) => (
          <button
            key={t}
            type="button"
            role="tab"
            id={`${id}-tab-${t}`}
            aria-selected={tab === t}
            aria-controls={`${id}-panel`}
            onClick={() => setTab(t)}
            className={`flex h-16 flex-col items-center justify-center gap-1 border-b-[3px] px-1 text-[13px] lg:h-15 lg:flex-row lg:gap-2 lg:px-4 lg:text-[15px] ${
              tab === t ? "border-sea font-bold text-ink" : "border-transparent font-semibold text-muted hover:text-ink"
            }`}
          >
            <Icon size={22} />
            <span className="lg:hidden">{short}</span>
            <span className="hidden lg:inline">{label}</span>
          </button>
        ))}
      </div>

      <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${tab}`} className="grid gap-4 p-4 lg:grid-cols-[1.1fr_1.5fr_1fr_1fr_220px] lg:items-center lg:gap-0 lg:p-5">
        {tab === "rent" && (
          <>
            <label className={fieldBox}>
              <span className={fieldLabel}>Vehicle</span>
              <select value={type} onChange={(e) => setType(e.target.value)} className={input}>
                <option value="scooter">Scooter</option>
                <option value="car">Car</option>
              </select>
            </label>
            <label className={fieldBox}>
              <span className={fieldLabel}>Deliver to</span>
              <span className="flex items-center gap-2"><MapPin size={18} className="shrink-0 text-sea" /><input value={area} onChange={(e) => setArea(e.target.value)} placeholder="Your hotel or villa" className={input} /></span>
            </label>
            <label className={fieldBox}>
              <span className={fieldLabel}>Pick-up</span>
              <span className="flex items-center gap-2"><Calendar size={18} className="hidden shrink-0 text-muted lg:block" /><input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={input} /></span>
            </label>
            <label className={`${fieldBox} lg:border-r-0`}>
              <span className={fieldLabel}>Return</span>
              <span className="flex items-center gap-2"><Calendar size={18} className="hidden shrink-0 text-muted lg:block" /><input type="date" min={from || undefined} value={to} onChange={(e) => setTo(e.target.value)} className={input} /></span>
            </label>
          </>
        )}
        {tab === "tours" && (
          <>
            <label className={`${fieldBox} lg:col-span-2`}>
              <span className={fieldLabel}>What do you feel like?</span>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={input}>
                <option value="">All experiences</option>
                {tourCategories.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </label>
            <label className={`${fieldBox} lg:col-span-2 lg:border-r-0`}>
              <span className={fieldLabel}>Date</span>
              <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={input} />
            </label>
          </>
        )}
        {tab === "driver" && (
          <>
            <label className={fieldBox}>
              <span className={fieldLabel}>Hours</span>
              <select value={hours} onChange={(e) => setHours(e.target.value)} className={input}>
                <option value="6">6 hours</option>
                <option value="10">10 hours</option>
                <option value="12">12 hours</option>
              </select>
            </label>
            <label className={fieldBox}>
              <span className={fieldLabel}>Pick-up from</span>
              <span className="flex items-center gap-2"><MapPin size={18} className="shrink-0 text-sea" /><input value={area} onChange={(e) => setArea(e.target.value)} placeholder="Your hotel or villa" className={input} /></span>
            </label>
            <label className={fieldBox}>
              <span className={fieldLabel}>Date</span>
              <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={input} />
            </label>
            <label className={`${fieldBox} lg:border-r-0`}>
              <span className={fieldLabel}>Travellers</span>
              <input type="number" min={1} max={14} value={pax} onChange={(e) => setPax(e.target.value)} className={input} />
            </label>
          </>
        )}
        {tab === "airport" && (
          <>
            <label className={fieldBox}>
              <span className={fieldLabel}>Direction</span>
              <select value={direction} onChange={(e) => setDirection(e.target.value)} className={input}>
                <option>From the airport</option>
                <option>To the airport</option>
              </select>
            </label>
            <label className={fieldBox}>
              <span className={fieldLabel}>Hotel or villa</span>
              <span className="flex items-center gap-2"><MapPin size={18} className="shrink-0 text-sea" /><input value={area} onChange={(e) => setArea(e.target.value)} placeholder="Where are you staying?" className={input} /></span>
            </label>
            <label className={fieldBox}>
              <span className={fieldLabel}>Date</span>
              <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={input} />
            </label>
            <label className={`${fieldBox} lg:border-r-0`}>
              <span className={fieldLabel}>Travellers</span>
              <input type="number" min={1} max={14} value={pax} onChange={(e) => setPax(e.target.value)} className={input} />
            </label>
          </>
        )}
        <button type="submit" className="flex h-14 items-center justify-center gap-2.5 rounded-2xl bg-sun text-[17px] font-bold text-ink hover:brightness-95 lg:h-15">
          <Search size={20} />
          {tab === "rent" || tab === "tours" ? "Search" : "Ask on WhatsApp"}
        </button>
      </div>
    </form>
  );
}
