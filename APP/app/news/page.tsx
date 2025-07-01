import React from "react";
import NewsCard from "@/components/ui/NewsCard";
import { HeroHeader } from "@/components/hero8-header";
import newsData from "@/data/newsData.json";

const Page = () => {
  return (
    <>
      <HeroHeader />
      <div className="h-12"></div>
      <main className="min-h-screen p-10 space-y-6">
        <NewsCard
          title="Summary"
          date=""
          summary={newsData["General Summary"]}
          sentimentScore={newsData["General Score"]}
          sentiment={
            (newsData["General Sentiment"].charAt(0).toUpperCase() +
              newsData["General Sentiment"].slice(1).toLowerCase()) as
              | "Positive"
              | "Negative"
              | "Neutral"
          }
        />

        {newsData.Titles.map((_, index) => {
          const title = newsData.Titles[index];
          const date = newsData.Dates[index];
          const sentimentRaw = newsData.Sentiments[index];
          const sentimentScore = newsData.Scores[index];
          const summary = newsData.Summaries[index];

          // Capitalizar sentimiento
          const sentiment =
            sentimentRaw.charAt(0).toUpperCase() +
            sentimentRaw.slice(1).toLowerCase();

          return (
            <NewsCard
              key={index}
              title={title}
              date={date}
              sentiment={sentiment as "Positive" | "Negative" | "Neutral"}
              sentimentScore={sentimentScore}
              summary={summary}
              dark={true} // alternar fondo blanco/negro
            />
          );
        })}
      </main>
    </>
  );
};

export default Page;
