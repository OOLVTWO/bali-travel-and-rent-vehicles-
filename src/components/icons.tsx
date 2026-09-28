import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Base({ size = 20, strokeWidth = 1.9, children, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const ArrowRight = (p: IconProps) => <Base {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Base>;
export const ArrowLeft = (p: IconProps) => <Base {...p}><path d="M19 12H5M11 18l-6-6 6-6" /></Base>;
export const ChevronRight = (p: IconProps) => <Base {...p}><path d="M9 6l6 6-6 6" /></Base>;
export const ChevronUp = (p: IconProps) => <Base {...p}><path d="M6 15l6-6 6 6" /></Base>;
export const ChevronDown = (p: IconProps) => <Base {...p}><path d="M6 9l6 6 6-6" /></Base>;
export const Search = (p: IconProps) => <Base {...p}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></Base>;
export const MapPin = (p: IconProps) => <Base {...p}><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></Base>;
export const Calendar = (p: IconProps) => <Base {...p}><rect x="3.5" y="5" width="17" height="15.5" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4" /></Base>;
export const Scooter = (p: IconProps) => <Base {...p}><circle cx="6" cy="17" r="3" /><circle cx="18" cy="17" r="3" /><path d="M9 17h6l2-7h-3M14 5h3l1 5M6 14l2-4h5" /></Base>;
export const Compass = (p: IconProps) => <Base {...p}><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5l-2 5-5 2 2-5z" /></Base>;
export const Steering = (p: IconProps) => <Base {...p}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="2.5" /><path d="M3.5 10.5l6 1M20.5 10.5l-6 1M12 14.5V21" /></Base>;
export const Plane = (p: IconProps) => <Base strokeWidth={1.6} {...p}><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" /></Base>;
export const Home = (p: IconProps) => <Base {...p}><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" /></Base>;
export const IdCard = (p: IconProps) => <Base {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="12" r="2.5" /><path d="M14 10h4M14 14h4" /></Base>;
export const Shield = (p: IconProps) => <Base {...p}><path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z" /><path d="M8.5 12l2.5 2.5 4.5-5" /></Base>;
export const Chat = (p: IconProps) => <Base {...p}><path d="M4 5h16v11H9l-5 4z" /><path d="M8 9h8M8 12h5" /></Base>;
export const Heart = (p: IconProps) => <Base {...p}><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /></Base>;
export const Users = (p: IconProps) => <Base {...p}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c.8-3.5 3.3-5.5 6.5-5.5s5.7 2 6.5 5.5" /><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.8c1.9.7 3.1 2.5 3.5 5.2" /></Base>;
export const Check = (p: IconProps) => <Base strokeWidth={2.2} {...p}><path d="M5 12.5l4.5 4.5L19 7" /></Base>;
export const CheckCircle = (p: IconProps) => <Base {...p}><circle cx="12" cy="12" r="9" /><path d="M8 12.5l2.8 2.8L16 10" /></Base>;
export const Alert = (p: IconProps) => <Base {...p}><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16.5v.01" /></Base>;
export const Clock = (p: IconProps) => <Base {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Base>;
export const Plus = (p: IconProps) => <Base strokeWidth={2.2} {...p}><path d="M12 5v14M5 12h14" /></Base>;
export const Minus = (p: IconProps) => <Base strokeWidth={2.2} {...p}><path d="M5 12h14" /></Base>;
export const X = (p: IconProps) => <Base strokeWidth={2.2} {...p}><path d="M6 6l12 12M18 6L6 18" /></Base>;
export const Menu = (p: IconProps) => <Base strokeWidth={2} {...p}><path d="M4 7h16M4 12h16M4 17h16" /></Base>;
export const Boat = (p: IconProps) => <Base {...p}><path d="M3 17l2 3h14l2-3z" /><path d="M5 17v-6h14v6M9 11V6h6v5" /></Base>;
export const Utensils = (p: IconProps) => <Base {...p}><path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M16 3c-1.7 1.3-2.5 3.5-2.5 6.5V13H16v8" /></Base>;
export const ImageIcon = (p: IconProps) => <Base {...p}><rect x="3.5" y="4.5" width="17" height="15" rx="2" /><circle cx="9" cy="10" r="1.8" /><path d="M20.5 16l-5-5-8.5 8.5" /></Base>;
export const Upload = (p: IconProps) => <Base {...p}><path d="M12 16V4M7 9l5-5 5 5" /><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" /></Base>;
export const Eye = (p: IconProps) => <Base {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></Base>;
export const Bell = (p: IconProps) => <Base {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0" /></Base>;
export const Grid = (p: IconProps) => <Base {...p}><rect x="3.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.5" /></Base>;
export const Ticket = (p: IconProps) => <Base {...p}><path d="M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4z" /></Base>;
export const Car = (p: IconProps) => <Base {...p}><path d="M3 16v-4l2-5h14l2 5v4z" /><circle cx="7.5" cy="16.5" r="1.8" /><circle cx="16.5" cy="16.5" r="1.8" /></Base>;
export const Gift = (p: IconProps) => <Base {...p}><rect x="4" y="9" width="16" height="11" rx="1.5" /><path d="M3 9h18M12 9v11" /></Base>;
export const Tag = (p: IconProps) => <Base {...p}><path d="M3 12V4h8l9 9-8 8z" /><circle cx="7.5" cy="8.5" r="1.3" /></Base>;
export const FileText = (p: IconProps) => <Base {...p}><path d="M6 3h8l4 4v14H6z" /><path d="M9 12h6M9 16h6" /></Base>;
export const Star = (p: IconProps) => <Base {...p}><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" /></Base>;
export const StarFilled = ({ size = 16, ...p }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" {...p}>
    <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />
  </svg>
);
export const User = (p: IconProps) => <Base {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.2-4 4.3-6 8-6s6.8 2 8 6" /></Base>;
export const Chart = (p: IconProps) => <Base {...p}><path d="M4 20V4M4 20h16" /><path d="M8 16v-4M12 16V8M16 16v-6" /></Base>;
export const Gear = (p: IconProps) => <Base {...p}><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" /></Base>;
export const Wrench = (p: IconProps) => <Base {...p}><path d="M14.7 6.3a4 4 0 0 0-5.4 5.2L3 17.8V21h3.2l6.3-6.3a4 4 0 0 0 5.2-5.4l-2.6 2.6-2.4-.5-.5-2.4z" /></Base>;
export const Share = (p: IconProps) => <Base {...p}><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M12 3v12M7 8l5-5 5 5" /></Base>;
export const Instagram = (p: IconProps) => <Base {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /></Base>;
export const Trash = (p: IconProps) => <Base {...p}><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" /></Base>;
export const Focus = (p: IconProps) => <Base {...p}><circle cx="12" cy="12" r="3" /><path d="M12 2v4M12 18v4M2 12h4M18 12h4" /></Base>;
export const WhatsApp = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 20l1.3-3.8A8 8 0 1 1 8 19z" />
    <path d="M9 8.5c0 3.5 2.5 6.5 6.5 6.5l1-1.8-2-1-1 .9c-1.2-.5-2.1-1.4-2.6-2.6l.9-1-1-2z" />
  </Base>
);

export function LogoMark({ size = 32, light = true }: { size?: number; light?: boolean }) {
  const wave = light ? "#FFFFFF" : "#0D2B3E";
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" fill="none" aria-hidden="true" focusable="false">
      <circle cx="17" cy="14" r="7" fill="#FFC940" />
      <path d="M3 24c4-3 8-3 11 0s8 3 11 0 6-3 6-3" stroke={wave} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M3 29c4-3 8-3 11 0s8 3 11 0 6-3 6-3" stroke={wave} strokeOpacity="0.55" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}
