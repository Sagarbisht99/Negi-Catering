const steps = [
  {
    n: "1",
    title: "Tell us your occasion",
    desc: "Share the date, guest count, and event type — house party, wedding, office, or festival.",
  },
  {
    n: "2",
    title: "Approve a fresh menu",
    desc: "We suggest dishes by category with veg options and live counters for easy comparison.",
  },
  {
    n: "3",
    title: "Confirm the booking",
    desc: "Once you approve menu and timing, we lock the slot. Nothing moves without your go-ahead.",
  },
  {
    n: "4",
    title: "We cook, serve & support",
    desc: "On-time delivery or on-site service — our team stays reachable till the last plate.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative border-y border-line bg-ivory-deep/50 py-10 md:py-20"
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-terracotta">
            Our Process
          </p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl md:text-5xl">
            From first enquiry to{" "}
            <span className="text-terracotta">happy guests</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
            A simple catering flow — share your event, approve the menu, confirm
            the booking, and we handle the rest.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:mt-14 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4 lg:gap-x-0">
          {steps.map((step, index) => (
            <div key={step.n} className="relative text-center">
              <div className="relative mx-auto h-[72px] w-full">
                <div className="absolute top-0 left-1/2 z-10 flex h-[72px] w-[72px] -translate-x-1/2 items-center justify-center">
                  <span className="absolute inset-0 rounded-full border border-terracotta/25" />
                  <span className="absolute inset-[5px] rounded-full border border-terracotta/40" />
                  <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-terracotta/10 font-display text-2xl font-semibold text-terracotta">
                    {step.n}
                  </span>
                </div>

                {index < steps.length - 1 ? (
                  <svg
                    className="pointer-events-none absolute top-2 hidden text-terracotta lg:block"
                    style={{
                      left: "calc(50% + 36px)",
                      width: "calc(100% - 72px)",
                      height: "56px",
                    }}
                    viewBox="0 0 200 56"
                    preserveAspectRatio="none"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M2 38 C 55 8, 145 8, 186 34"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeDasharray="5 6"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                    />
                    <path
                      d="M176 26 L198 36 L174 42 Z"
                      fill="currentColor"
                    />
                  </svg>
                ) : null}
              </div>

              <h3 className="mt-5 text-lg font-bold text-ink md:text-xl">
                {step.title}
              </h3>
              <p className="mx-auto mt-2 max-w-[240px] text-sm leading-relaxed text-muted">
                {step.desc}
              </p>

              {index < steps.length - 1 ? (
                <div
                  className="mt-4 flex justify-center text-terracotta sm:hidden"
                  aria-hidden
                >
                  <svg width="28" height="40" viewBox="0 0 28 40" fill="none">
                    <path
                      d="M14 2 C 4 14, 4 26, 14 34"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeDasharray="4 5"
                      strokeLinecap="round"
                    />
                    <path d="M9 30 L14 36 L19 30 Z" fill="currentColor" />
                  </svg>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
