type Props = {
  eyebrow: string;
  title: string;
  aside?: React.ReactNode;
  dark?: boolean;
  id?: string;
};

export function SectionHeading({ eyebrow, title, aside, dark = false, id }: Props) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
      <div className="flex max-w-3xl flex-col gap-3.5">
        <span className={`text-[13px] font-bold tracking-[0.16em] uppercase ${dark ? "text-sun" : "text-sea"}`}>{eyebrow}</span>
        <h2 id={id} className="font-display text-4xl leading-[1.06] font-semibold tracking-[-0.015em] sm:text-5xl lg:text-[52px]">
          {title}
        </h2>
      </div>
      {aside}
    </div>
  );
}
