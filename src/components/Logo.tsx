"use client";

type LogoProps = {
  className?: string;
  width?: number;
  height?: number;
  subtitle?: string;
};

export default function Logo({
  className = "",
  width = 32,
  height = 32,
  subtitle,
}: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-950"
        style={{ width, height }}
      >
        <img
          src="/logo/logo.png"
          alt="CampusLink"
          width={width}
          height={height}
          className="object-contain"
        />
      </div>

      <div className="leading-none">
        <div className="text-[17px] font-bold tracking-tight">
          Campus<span className="text-indigo-600">Link</span>
        </div>

        {subtitle && (
          <div className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}
