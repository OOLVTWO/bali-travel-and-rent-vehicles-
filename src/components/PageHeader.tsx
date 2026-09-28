type Props = { eyebrow: string; title: string; text?: string };

export function PageHeader({ eyebrow, title, text }: Props) {
  return (
    <div className="bg-mist px-4 pt-14 pb-12 sm:px-6 lg:px-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-3.5">
        <span className="text-[13px] font-bold tracking-[0.16em] text-sea uppercase">{eyebrow}</span>
        <h1 className="max-w-3xl font-display text-4xl leading-[1.06] font-semibold tracking-[-0.015em] sm:text-[52px]">{title}</h1>
        {text && <p className="max-w-2xl text-[17px] leading-relaxed text-muted">{text}</p>}
      </div>
    </div>
  );
}
