import Image from "next/image";

export default function ContentSection() {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <h2 className="relative z-10 max-w-xl text-4xl font-medium lg:text-5xl">
          Pretrained Transformers
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 md:gap-12 lg:gap-24">
          <div className="relative mb-6 sm:mb-0">
            <div className="bg-linear-to-b aspect-76/59 relative rounded-2xl from-zinc-300 to-transparent p-px dark:from-zinc-700">
              <Image
                src="/transformers.png"
                className="hidden rounded-[15px] dark:block"
                alt="payments illustration dark"
                width={1207}
                height={929}
              />
            </div>
          </div>

          <div className="relative space-y-4">
            <p className="text-muted-foreground">
              Here we use pretrained tranfrormers{" "}
              <span className="text-accent-foreground font-bold">
                just like chat GPT
              </span>{" "}
              to help you with your decision making.
            </p>
            <p className="text-muted-foreground">
              Transformers are a neural network cutting edge architecture that
              allows having more context when forecasting timeseries or be able
              to summarize and analize news. It basically does all the heavy
              lifting for the common investor who doesn't have the time and
              wants their money to be save.
            </p>

            <div className="pt-6">
              <blockquote className="border-l-4 pl-4">
                <p>
                  "The greatest danger in times of turbulence is not the
                  turbulence—it is to act with yesterday's logic."
                </p>

                <div className="mt-6 space-y-3">
                  <cite className="block font-medium">Peter Drucker</cite>
                </div>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
