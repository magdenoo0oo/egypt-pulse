import type { Code, GoldType } from "@/lib/currencies";

type Faq = { q: string; a: string };

export const CURRENCY_NOTES_EN: Record<Code, { about: string; why: string; faq: Faq[] }> = {
  usd: {
    about: "The currency of the United States, and the most widely used currency in world trade and in central bank reserves. Most basic commodities such as energy and metals are priced in it.",
    why: "The dollar is the first reference for anyone in Egypt who imports, travels or follows prices, and its rate affects many local prices. Most Gulf currencies are also pegged to it, so its moves carry over to other currencies.",
    faq: [
      { q: "How is the US dollar priced here?", a: "The price is in Egyptian pounds per one unit. It is recorded once a day from an open data source, and its history is available for up to a year." },
      { q: "What moves the US dollar against the Egyptian pound?", a: "It is affected by the supply of and demand for dollars in Egypt: remittances, tourism and exports on one side, and imports and debt payments on the other. It is also affected by the dollar's strength worldwide, US interest-rate decisions, and the exchange-rate regime in place." },
      { q: "Is this the US dollar rate at a bank?", a: "The rate shown here is a reference (mid-market) rate calculated from the world market, not a buy or sell price at a bank or exchange office. Ask the provider you will deal with for its actual rate and fees." },
    ],
  },
  eur: {
    about: "The shared currency of a number of European countries, and the second most traded currency in the world after the dollar. It is used in trade and tourism between Europe and the world.",
    why: "Europe is a major trade and tourism partner of Egypt, so the euro matters to exporters, importers, travelers and students there. It is also used as an alternative to the dollar in some savings.",
    faq: [
      { q: "How is the euro priced here?", a: "The price is in Egyptian pounds per one unit. It is recorded once a day from an open data source, and its history is available for up to a year." },
      { q: "What moves the euro against the Egyptian pound?", a: "It is affected by the euro's rate against the dollar worldwide, because its price in pounds is calculated through the dollar. It is also affected by the pound's move against the dollar, and by European Central Bank decisions and the European economy." },
      { q: "Is this the euro rate at a bank?", a: "The rate shown here is a reference (mid-market) rate calculated from the world market, not a buy or sell price at a bank or exchange office. Ask the provider you will deal with for its actual rate and fees." },
    ],
  },
  gbp: {
    about: "The currency of the United Kingdom, and one of the oldest currencies still in use in the world. It is one of the currencies quoted at a high value per single unit against the dollar and the euro.",
    why: "Britain is a well-known destination for study, medical treatment, travel and work for many Egyptians. So the sterling rate matters to anyone who pays expenses there or receives transfers from there.",
    faq: [
      { q: "How is the pound sterling priced here?", a: "The price is in Egyptian pounds per one unit. It is recorded once a day from an open data source, and its history is available for up to a year." },
      { q: "What moves the pound sterling against the Egyptian pound?", a: "It is affected by sterling's rate against the dollar worldwide, Bank of England decisions and UK economic data. It is also affected by the pound's move against the dollar." },
      { q: "Is this the pound sterling rate at a bank?", a: "The rate shown here is a reference (mid-market) rate calculated from the world market, not a buy or sell price at a bank or exchange office. Ask the provider you will deal with for its actual rate and fees." },
    ],
  },
  chf: {
    about: "The currency of Switzerland, regarded as relatively stable. Many investors turn to it in times of global anxiety.",
    why: "Egyptians follow it if they have dealings with Switzerland, whether travel, study or work, or if they watch currencies as a gauge of stability. It is not as widely used as the dollar and the euro in the local market.",
    faq: [
      { q: "How is the Swiss franc priced here?", a: "The price is in Egyptian pounds per one unit. It is recorded once a day from an open data source, and its history is available for up to a year." },
      { q: "What moves the Swiss franc against the Egyptian pound?", a: "It is affected by the franc's rate against the dollar worldwide, and it often strengthens in periods of market anxiety. It is also affected by the pound's move against the dollar." },
      { q: "Is this the Swiss franc rate at a bank?", a: "The rate shown here is a reference (mid-market) rate calculated from the world market, not a buy or sell price at a bank or exchange office. Ask the provider you will deal with for its actual rate and fees." },
    ],
  },
  sar: {
    about: "The currency of the Kingdom of Saudi Arabia, pegged to the dollar at a fixed rate. It is used in all everyday transactions in the Kingdom.",
    why: "A large number of Egyptians work in Saudi Arabia and send money home from there, and Umrah and Hajj also create seasonal demand for the riyal. So its rate matters to many families.",
    faq: [
      { q: "How is the Saudi riyal priced here?", a: "The price is in Egyptian pounds per one unit. It is recorded once a day from an open data source, and its history is available for up to a year." },
      { q: "What moves the Saudi riyal against the Egyptian pound?", a: "Because the riyal is pegged to the dollar, its move against the pound roughly follows the dollar's move against the pound, so the factors are the same as the dollar's." },
      { q: "Is this the Saudi riyal rate at a bank?", a: "The rate shown here is a reference (mid-market) rate calculated from the world market, not a buy or sell price at a bank or exchange office. Ask the provider you will deal with for its actual rate and fees." },
    ],
  },
  aed: {
    about: "The currency of the United Arab Emirates, pegged to the dollar at a fixed rate. It is used in trade, tourism and services in the Emirates.",
    why: "The Emirates is a destination for work, tourism and trade for many Egyptians, so the dirham matters to people working there and their families, and also to travelers and traders.",
    faq: [
      { q: "How is the UAE dirham priced here?", a: "The price is in Egyptian pounds per one unit. It is recorded once a day from an open data source, and its history is available for up to a year." },
      { q: "What moves the UAE dirham against the Egyptian pound?", a: "Because the dirham is pegged to the dollar, its rate against the pound moves roughly with the dollar, so the factors are the same as the dollar's." },
      { q: "Is this the UAE dirham rate at a bank?", a: "The rate shown here is a reference (mid-market) rate calculated from the world market, not a buy or sell price at a bank or exchange office. Ask the provider you will deal with for its actual rate and fees." },
    ],
  },
  kwd: {
    about: "The currency of Kuwait, and one of the highest-valued currencies per single unit in the world. That comes from how it is priced, not necessarily from the strength of the economy.",
    why: "Some Egyptians work in Kuwait and send money home, so the dinar matters to their families. Because its value per unit is high, its numbers in pounds look large compared with other currencies.",
    faq: [
      { q: "How is the Kuwaiti dinar priced here?", a: "The price is in Egyptian pounds per one unit. It is recorded once a day from an open data source, and its history is available for up to a year." },
      { q: "What moves the Kuwaiti dinar against the Egyptian pound?", a: "It is affected by the movement of the dollar and of the currencies in the basket the dinar is linked to, and by the pound's move against the dollar. Oil prices also affect Kuwait's economy in general." },
      { q: "Is this the Kuwaiti dinar rate at a bank?", a: "The rate shown here is a reference (mid-market) rate calculated from the world market, not a buy or sell price at a bank or exchange office. Ask the provider you will deal with for its actual rate and fees." },
    ],
  },
  qar: {
    about: "The currency of the State of Qatar, pegged to the dollar at a fixed rate. It is used in all everyday transactions in Qatar.",
    why: "Qatar has a large Egyptian community that works and sends money to relatives, so the Qatari riyal matters to those families. It also matters to travelers and traders.",
    faq: [
      { q: "How is the Qatari riyal priced here?", a: "The price is in Egyptian pounds per one unit. It is recorded once a day from an open data source, and its history is available for up to a year." },
      { q: "What moves the Qatari riyal against the Egyptian pound?", a: "Because the Qatari riyal is pegged to the dollar, its move against the pound roughly follows the dollar's, and the factors are the same." },
      { q: "Is this the Qatari riyal rate at a bank?", a: "The rate shown here is a reference (mid-market) rate calculated from the world market, not a buy or sell price at a bank or exchange office. Ask the provider you will deal with for its actual rate and fees." },
    ],
  },
  bhd: {
    about: "The currency of the Kingdom of Bahrain, pegged to the dollar at a fixed rate. It is one of the currencies with a high value per unit.",
    why: "Some Egyptians work in Bahrain and send money home, but dealings in it are smaller than in the Saudi riyal or the dirham. So it matters mainly to families tied to Bahrain.",
    faq: [
      { q: "How is the Bahraini dinar priced here?", a: "The price is in Egyptian pounds per one unit. It is recorded once a day from an open data source, and its history is available for up to a year." },
      { q: "What moves the Bahraini dinar against the Egyptian pound?", a: "Because the Bahraini dinar is pegged to the dollar, its move against the pound roughly follows the dollar's move." },
      { q: "Is this the Bahraini dinar rate at a bank?", a: "The rate shown here is a reference (mid-market) rate calculated from the world market, not a buy or sell price at a bank or exchange office. Ask the provider you will deal with for its actual rate and fees." },
    ],
  },
  omr: {
    about: "The currency of the Sultanate of Oman, pegged to the dollar at a fixed rate. One unit of it is worth a lot against most currencies.",
    why: "Some Egyptians work in Oman and send money home to their families, and travelers and traders with dealings there also follow it.",
    faq: [
      { q: "How is the Omani rial priced here?", a: "The price is in Egyptian pounds per one unit. It is recorded once a day from an open data source, and its history is available for up to a year." },
      { q: "What moves the Omani rial against the Egyptian pound?", a: "Because the Omani rial is pegged to the dollar, its rate against the pound roughly moves with the dollar." },
      { q: "Is this the Omani rial rate at a bank?", a: "The rate shown here is a reference (mid-market) rate calculated from the world market, not a buy or sell price at a bank or exchange office. Ask the provider you will deal with for its actual rate and fees." },
    ],
  },
  jod: {
    about: "The currency of the Hashemite Kingdom of Jordan, pegged to the dollar at a fixed rate. One unit is worth a lot against most currencies.",
    why: "Jordan is a neighboring country with trade, tourism and Egyptian workers, so the Jordanian dinar matters to travelers, traders and families tied to Jordan.",
    faq: [
      { q: "How is the Jordanian dinar priced here?", a: "The price is in Egyptian pounds per one unit. It is recorded once a day from an open data source, and its history is available for up to a year." },
      { q: "What moves the Jordanian dinar against the Egyptian pound?", a: "Because the Jordanian dinar is pegged to the dollar, its rate against the pound roughly moves with the dollar." },
      { q: "Is this the Jordanian dinar rate at a bank?", a: "The rate shown here is a reference (mid-market) rate calculated from the world market, not a buy or sell price at a bank or exchange office. Ask the provider you will deal with for its actual rate and fees." },
    ],
  },
  cad: {
    about: "The currency of Canada, one of the currencies linked to commodity prices such as oil and metals. It trades heavily in world markets.",
    why: "Canada is a destination for immigration and study for many Egyptians, so the Canadian dollar matters to those who send expenses or receive transfers from there.",
    faq: [
      { q: "How is the Canadian dollar priced here?", a: "The price is in Egyptian pounds per one unit. It is recorded once a day from an open data source, and its history is available for up to a year." },
      { q: "What moves the Canadian dollar against the Egyptian pound?", a: "It is affected by its rate against the US dollar worldwide, by energy and commodity prices, and by Bank of Canada decisions. It is also affected by the pound's move against the dollar." },
      { q: "Is this the Canadian dollar rate at a bank?", a: "The rate shown here is a reference (mid-market) rate calculated from the world market, not a buy or sell price at a bank or exchange office. Ask the provider you will deal with for its actual rate and fees." },
    ],
  },
  aud: {
    about: "The currency of Australia, which trades heavily worldwide. It is strongly affected by metal prices and by trade with Asia.",
    why: "Australia is a destination for immigration, study and work for some Egyptians, so the Australian dollar matters to those tied to it through transfers or expenses.",
    faq: [
      { q: "How is the Australian dollar priced here?", a: "The price is in Egyptian pounds per one unit. It is recorded once a day from an open data source, and its history is available for up to a year." },
      { q: "What moves the Australian dollar against the Egyptian pound?", a: "It is affected by its rate against the US dollar worldwide, by metal prices and Chinese demand, and by Reserve Bank of Australia decisions. It is also affected by the pound's move against the dollar." },
      { q: "Is this the Australian dollar rate at a bank?", a: "The rate shown here is a reference (mid-market) rate calculated from the world market, not a buy or sell price at a bank or exchange office. Ask the provider you will deal with for its actual rate and fees." },
    ],
  },
  try: {
    about: "The currency of Turkey. It is quoted in large numbers against the dollar, so the value of a single unit in pounds is small.",
    why: "Turkey is a nearby destination for tourism and trade, and goods are bought and imported from there. So the lira matters to travelers and traders.",
    faq: [
      { q: "How is the Turkish lira priced here?", a: "The price is in Egyptian pounds per one unit. It is recorded once a day from an open data source, and its history is available for up to a year." },
      { q: "What moves the Turkish lira against the Egyptian pound?", a: "It is affected by Turkish central bank decisions and the Turkish economy, and by its rate against the dollar worldwide. It is also affected by the pound's move against the dollar." },
      { q: "Is this the Turkish lira rate at a bank?", a: "The rate shown here is a reference (mid-market) rate calculated from the world market, not a buy or sell price at a bank or exchange office. Ask the provider you will deal with for its actual rate and fees." },
    ],
  },
  cny: {
    about: "The currency of China, also called the renminbi. China is one of the biggest economies in the world, and the yuan's use in international trade is growing.",
    why: "China is one of Egypt's biggest sources of imports, so traders and importers follow the yuan closely. So does anyone who buys goods from China.",
    faq: [
      { q: "How is the Chinese yuan priced here?", a: "The price is in Egyptian pounds per one unit. It is recorded once a day from an open data source, and its history is available for up to a year." },
      { q: "What moves the Chinese yuan against the Egyptian pound?", a: "It is affected by the policy of China's central bank, which controls its movement to a large degree, and by its rate against the dollar. It is also affected by the pound's move against the dollar." },
      { q: "Is this the Chinese yuan rate at a bank?", a: "The rate shown here is a reference (mid-market) rate calculated from the world market, not a buy or sell price at a bank or exchange office. Ask the provider you will deal with for its actual rate and fees." },
    ],
  },
  jpy: {
    about: "The currency of Japan, and one of the most traded currencies in the world. It is quoted in large numbers against the dollar, so a single unit is worth little.",
    why: "Japan exports cars, equipment and electronics, so the yen matters to importers and to people interested in device prices. It is also followed as a currency that money sometimes flows into in anxious times.",
    faq: [
      { q: "How is the Japanese yen priced here?", a: "The price is in Egyptian pounds per 100 units, the way exchange offices quote it. It is recorded once a day from an open data source, and its history is available for up to a year." },
      { q: "What moves the Japanese yen against the Egyptian pound?", a: "It is affected by Bank of Japan decisions and its rate against the dollar worldwide, and by the pound's move against the dollar." },
      { q: "Is this the Japanese yen rate at a bank?", a: "The rate shown here is a reference (mid-market) rate calculated from the world market, not a buy or sell price at a bank or exchange office. Ask the provider you will deal with for its actual rate and fees." },
    ],
  },
  inr: {
    about: "The currency of India, one of the biggest economies in the world. One rupee is worth little against the dollar.",
    why: "India is a trade partner of Egypt in a range of goods and services, so traders and importers follow the rupee. It also shows up for people who work with Indian companies.",
    faq: [
      { q: "How is the Indian rupee priced here?", a: "The price is in Egyptian pounds per 100 units, the way exchange offices quote it. It is recorded once a day from an open data source, and its history is available for up to a year." },
      { q: "What moves the Indian rupee against the Egyptian pound?", a: "It is affected by Reserve Bank of India decisions and its rate against the dollar, and by the energy prices India imports. It is also affected by the pound's move against the dollar." },
      { q: "Is this the Indian rupee rate at a bank?", a: "The rate shown here is a reference (mid-market) rate calculated from the world market, not a buy or sell price at a bank or exchange office. Ask the provider you will deal with for its actual rate and fees." },
    ],
  },
  sek: {
    about: "The currency of Sweden. It trades worldwide in smaller volumes than the dollar and the euro.",
    why: "Sweden is a destination for immigration and study for some Egyptians, so the krona matters to those with expenses or transfers tied to it.",
    faq: [
      { q: "How is the Swedish krona priced here?", a: "The price is in Egyptian pounds per one unit. It is recorded once a day from an open data source, and its history is available for up to a year." },
      { q: "What moves the Swedish krona against the Egyptian pound?", a: "It is affected by Riksbank decisions and its rate against the euro and the dollar worldwide. It is also affected by the pound's move against the dollar." },
      { q: "Is this the Swedish krona rate at a bank?", a: "The rate shown here is a reference (mid-market) rate calculated from the world market, not a buy or sell price at a bank or exchange office. Ask the provider you will deal with for its actual rate and fees." },
    ],
  },
};

export const GOLD_NOTES_EN: Record<GoldType, { about: string; faq: Faq[] }> = {
  "24": {
    about: "24k is pure gold, or very close to it, with a purity of 24 parts out of 24. It is the reference from which the prices of the other karats are calculated.",
    faq: [
      { q: "Why isn't much jewelry made from 24k?", a: "Because it is a soft metal that scratches and bends easily. Everyday jewelry is usually a lower karat so it is harder." },
      { q: "Is this the 24k price in shops?", a: "No. This is a reference price calculated from the world price. It has no making charge or shop margin. A shop's price is higher." },
    ],
  },
  "21": {
    about: "21k means 21 parts gold out of every 24, which is 87.5% purity. It is the best known for worked pieces and for the gold pound in the Egyptian market.",
    faq: [
      { q: "How is the 21k price calculated?", a: "We multiply the 24k gram price by 21 and divide by 24. This calculation is repeated every day from the same reference price." },
      { q: "Why is the shop price higher than the number here?", a: "Because the shop adds a making charge and a margin, and it buys from you at a lower price than it sells. The number here is only the value of the gold at the world price." },
    ],
  },
  "18": {
    about: "18k means 18 parts gold out of every 24, which is 75% purity. It is widely used in fine designs and in pieces that hold stones, because it is harder than the higher karats.",
    faq: [
      { q: "What is the difference between 18k and 21k?", a: "21k has higher purity, so its price per gram is higher. 18k is harder, and its color can be affected by the added metals." },
      { q: "Does the 18k price here include the making charge?", a: "No. It is the value of the gold at the reference price. The shop adds the making charge separately." },
    ],
  },
  "14": {
    about: "14k means 14 parts gold out of every 24, which is about 58.3% purity. It is used to make pieces that stand up to everyday wear at a lower price.",
    faq: [
      { q: "Why is 14k cheaper?", a: "Because it has a smaller share of gold and the rest is other metals. So the price per gram is calculated by the purity share." },
      { q: "Is 14k common in the Egyptian market?", a: "Availability varies from shop to shop. Ask the shop what it has in stock and about the hallmark on the piece." },
    ],
  },
  "pound": {
    about: "The gold pound is a coin weighing 8 grams of 21k. It is sold on the basis of its weight and karat, with the shop's margin added on top.",
    faq: [
      { q: "How is the gold pound price calculated here?", a: "We multiply the 21k gram price by 8. That is the reference price with no extras." },
      { q: "Why is its price in the shop different?", a: "Because the shop adds a margin and often a small making charge, and it buys at a lower price than it sells. The difference varies from shop to shop." },
    ],
  },
  "half-pound": {
    about: "The half gold pound weighs 4 grams of 21k. It is an option for anyone who wants a piece worth less than a full pound.",
    faq: [
      { q: "How is the half pound price calculated here?", a: "We multiply the 21k gram price by 4. It is exactly half the reference price of the gold pound." },
      { q: "Is the shop margin on the half the same as on the pound?", a: "Not necessarily. The margin on smaller pieces varies from shop to shop, so ask." },
    ],
  },
  "ounce": {
    about: "The ounce is the unit of weight for precious metals in the world market, about 31.1 grams. Here it means an ounce of 24k.",
    faq: [
      { q: "Why does the ounce matter?", a: "Because gold is priced worldwide in dollars per ounce, and that is the basis from which we calculate the gram price in pounds." },
      { q: "Is the ounce sold in Egypt?", a: "The ounce is mostly a pricing reference more than a piece that is sold. Ask dealers about the bars available and their weights." },
    ],
  },
};
