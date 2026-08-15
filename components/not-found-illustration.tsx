function Topping({
  cx,
  cy,
  rotate = 0,
}: {
  cx: number;
  cy: number;
  rotate?: number;
}) {
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rotate})`}>
      <circle r="14" fill="var(--app-color-danger)" />
      <circle cx="-4" cy="-4" r="2.5" fill="var(--app-color-danger-active)" />
      <circle cx="5" cy="3" r="2" fill="var(--app-color-danger-active)" />
    </g>
  );
}

export function NotFoundIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-[38rem]" aria-hidden="true">
      <div className="absolute left-[5%] top-[12%] h-16 w-16 rounded-full bg-primary-soft sm:h-24 sm:w-24" />
      <div className="absolute bottom-[7%] right-[4%] h-12 w-12 rounded-full bg-warning-soft sm:h-20 sm:w-20" />

      <div className="relative flex items-center justify-center gap-1 sm:gap-3">
        <span className="select-none text-[8.5rem] font-black leading-none tracking-[-0.08em] text-secondary-active sm:text-[13rem]">
          4
        </span>

        <svg
          className="h-[8.3rem] w-[8.3rem] shrink-0 overflow-visible sm:h-[12.5rem] sm:w-[12.5rem]"
          viewBox="0 0 220 220"
        >
          <ellipse
            cx="110"
            cy="202"
            rx="82"
            ry="10"
            fill="var(--app-color-border)"
            opacity="0.7"
          />
          <circle cx="110" cy="105" r="95" fill="var(--app-color-warning)" />
          <circle cx="110" cy="105" r="79" fill="var(--app-color-warning-soft)" />
          <path
            d="M110 105 167 50a78 78 0 0 1 21 68Z"
            fill="var(--app-color-background)"
          />
          <path
            d="M110 105 188 118"
            fill="none"
            stroke="var(--app-color-primary-active)"
            strokeLinecap="round"
            strokeWidth="5"
          />
          <Topping cx={76} cy={65} rotate={-8} />
          <Topping cx={61} cy={123} rotate={12} />
          <Topping cx={124} cy={147} rotate={-12} />
          <Topping cx={151} cy={91} rotate={5} />
          <path
            d="M97 42c12 2 18 10 17 22-12 2-21-3-26-13 1-5 4-8 9-9Z"
            fill="var(--app-color-success)"
          />
          <path
            d="M156 137c10 3 15 10 13 20-10 1-18-4-21-13 1-4 4-7 8-7Z"
            fill="var(--app-color-success-active)"
          />
          <path
            d="M94 168c-8 3-16 0-20-8 5-7 12-9 20-5 2 5 2 9 0 13Z"
            fill="var(--app-color-success)"
          />
          <path
            d="m184 50 18-17m-9 28 17-2"
            fill="none"
            stroke="var(--app-color-primary)"
            strokeLinecap="round"
            strokeWidth="6"
          />
        </svg>

        <span className="select-none text-[8.5rem] font-black leading-none tracking-[-0.08em] text-secondary-active sm:text-[13rem]">
          4
        </span>
      </div>

      <div className="mx-auto -mt-2 h-2 w-2/3 rounded-full bg-border/70 blur-[1px] sm:-mt-4" />
    </div>
  );
}
