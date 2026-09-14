import { CreationFlowPreview } from "./CreationFlowPreview";

export function Hero() {
  return (
    <section className="relative min-h-[calc(100svh-4rem)] overflow-hidden pt-16">
      {/* Yellow splash background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Main center splash */}
        <div className="absolute left-1/2 -top-20 h-130 w-225 -translate-x-1/2 rounded-[50%] bg-yellow-300/20 blur-[100px]" />

        <div className="absolute left-1/2 top-[8%] h-70 w-150 -translate-x-1/2 rounded-[45%] bg-yellow-200/30 blur-[80px]" />

        {/* Left splash */}
        <div className="absolute -left-64 top-[18%] h-130 w-130 rounded-full bg-yellow-300/30 blur-[90px]" />

        <div className="absolute -left-24 top-[42%] h-65 w-65 rounded-full bg-yellow-200/35 blur-[70px]" />

        {/* Right splash */}
        <div className="absolute -right-64 top-[20%] h-135 w-135 rounded-full bg-yellow-300/30 blur-[100px]" />

        <div className="absolute -right-28 top-[45%] h-70 w-70 rounded-full bg-yellow-200/35 blur-[70px]" />

        {/* Small splash marks */}
        <div className="absolute left-[12%] top-[18%] h-16 w-32 rotate-[-18deg] rounded-[50%] bg-yellow-300/20 blur-2xl" />

        <div className="absolute right-[14%] top-[25%] h-20 w-36 rotate-15 rounded-[50%] bg-yellow-300/20 blur-2xl" />
      </div>

      <div className="mx-auto flex max-w-7xl flex-col px-4 pb-12 sm:px-6 lg:px-8">
        {/* Hero heading */}
        <div className="relative z-10 shrink-0 pt-8 text-center md:pt-10">
          <h1 className="mx-auto max-w-4xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Turn your idea into a website.
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
            Tell us what you need, and Sencill AI builds your website.
          </p>
        </div>

        {/* Creation flow */}
        <div className="relative z-10 mt-8 md:mt-10">
          <CreationFlowPreview />
        </div>
      </div>
    </section>
  );
}
