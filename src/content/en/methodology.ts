import type { Block } from "../guides";

export const methodologyEn = (latest: string): Block[] => [
  { type: "h", text: "Where the prices come from" },
  { type: "p", text: `Every day we pull exchange rates from an open dataset (fawazahmed0/currency-api) and record them in a file in the repository on GitHub. The latest day we have: ${latest}. The daily commits are made automatically, and this is stated in the README.` },
  { type: "h", text: "A reference rate, not a bank rate" },
  { type: "p", text: "The prices here are mid-market, meaning the midpoint between the buy and sell price in the world market. Banks and exchange offices buy and sell at a different rate, and the gap in Egypt can be large. Use them for following, comparing and spotting direction, not for working out what you will actually pay." },
  { type: "h", text: "Gold and silver" },
  { type: "p", text: "A gram of 24k gold = (dollar price in pounds ÷ ounce price in dollars) ÷ 31.1034768 grams. The other karats are a share of 24k: 21k = 21÷24, 18k = 18÷24, 14k = 14÷24. The gold pound is 8 grams of 21k, and the half pound is 4 grams. Silver is calculated the same way from the silver ounce price." },
  { type: "p", text: "There is no making charge, hallmark fee or dealer margin here. In the gold calculator you can enter an estimated making-charge percentage yourself." },
  { type: "h", text: "Quote units" },
  { type: "p", text: "Every price is in pounds per single unit of the currency, except the Japanese yen and the Indian rupee, which are per 100 units, the way exchange offices quote them." },
  { type: "h", text: "Gaps" },
  { type: "p", text: "Sometimes the source runs a day late. In that case we record the latest day available rather than guess, and a day may be missing from the history. The daily change is calculated against the last record before it." },
  { type: "h", text: "Reports and analysis" },
  { type: "p", text: "The texts titled \"Quick read\" and \"Market report\" are written automatically from the recorded numbers using fixed templates. They contain no forecasts or opinions. Daily volatility is the standard deviation of the daily percentage change over the last 30 days." },
  { type: "h", text: "Charts" },
  { type: "p", text: "The interactive charts use the open-source TradingView Lightweight Charts™ library. The other charts (daily moves, one-year range) are generated from the data itself." },
  { type: "note", text: "Not financial advice. If you find a wrong number, open an issue on GitHub in the project repository." },
];
