"use client";

import React from "react";
import clsx from "clsx";

type Sentiment = "Positive" | "Negative" | "Neutral";

interface NewsCardProps {
  title: string;
  date: string;
  sentiment: Sentiment;
  summary: string;
  dark?: boolean;
  sentimentScore?: number;
}

const sentimentColor = {
  Positive: "bg-green-500",
  Negative: "bg-red-500",
  Neutral: "bg-yellow-500",
};

const NewsCard: React.FC<NewsCardProps> = ({
  title,
  date,
  sentiment,
  summary,
  dark = false,
  sentimentScore,
}) => {
  return (
    <div
      className={clsx(
        "rounded-2xl p-6 shadow-md transition-all",
        dark
          ? "bg-black text-white border border-white/20"
          : "bg-white text-black"
      )}
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className={clsx("text-xl font-semibold", dark && "text-white")}>
            {title}
          </h2>
          <p className="text-sm text-gray-400">{date}</p>
        </div>
        <div className="flex flex-col items-end">
          <div
            className={clsx(
              "text-white font-bold px-4 py-1 rounded-full text-sm",
              sentimentColor[sentiment]
            )}
          >
            {sentiment}
          </div>
          {sentimentScore !== undefined && (
            <span className="text-xs text-gray-400 mt-1">
              {sentimentScore.toFixed(8)}
            </span>
          )}
        </div>
      </div>
      <p className="mt-4 text-base">{summary}</p>
    </div>
  );
};

export default NewsCard;
