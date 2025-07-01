import { HeroHeader } from '../../components/hero8-header';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <>
      <HeroHeader />

      <main className="bg-black min-h-screen text-white px-6 md:px-16 py-10">
        {/* Sección principal superior */}
        <section className="flex flex-col md:flex-row items-center justify-between gap-10 mb-16">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Profeteia positions itself as an all-in-one solution for traders operating in multiple markets. 
            </h1>
            <p className="text-gray-300">
              Unlike tools specialized in a single asset type, it offers a unified approach to analyzing different financial instruments.
            </p>
          </div>

          <div>
            {}
            <Image
              src="/network-graph.png"
              alt="Network Graph"
              width={400}
              height={400}
              className="rounded-lg"
            />
          </div>
        </section>

        {}
        <section className="flex flex-col md:flex-row gap-10 items-start mb-16">
          <div className="rotate-[-90deg] text-5xl font-bold whitespace-nowrap">
            About Us
          </div>

          <div className="bg-white text-black p-8 rounded-xl shadow-lg flex-1">
            <p>
              Profeteia is an advanced system that combines machine learning, quantum analysis, 
              and algorithmic trading to predict stock market movements and risks.
              It uses artificial intelligence to process market data and financial news, generating predictions about price movements.
            </p>
          </div>
        </section>

        {}
        <section className="flex flex-col md:flex-row items-start gap-10 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-md flex-1">
            <Image
              src="/timeseries.png"
              alt="Timeseries Graph"
              width={600}
              height={400}
              className="rounded-md"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-semibold mb-4">
              Mision
            </h2>
            <p className="text-gray-300">
              Our mission is to support people interested in trading and provide a solid foundation for starting
              to invest safely and with knowledge.
            </p>
          </div>
        </section>

        {}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-4">
            Vision
          </h2>
          <p className="text-gray-300">
            The long-term vision is to make Profeteia a leading platform for investors seeking accessible 
            and reliable tools in the stock market.
          </p>
        </section>

        {}
        <section className="bg-white text-black p-6 rounded-xl shadow-lg max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Summary</h3>
            <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm">
              Positive
            </span>
          </div>
          <p>
            US stocks continued to go up after the weekend. Futures remained
            stable relative to the trading week start as investors awaited key
            data on the labor market, including jobs and wages. The leading
            Composite saw gains for the first time this year.
          </p>
        </section>
      </main>
    </>
  );
}
