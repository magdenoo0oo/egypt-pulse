import type { Guide } from "../guides";

export const GUIDES_EN: Guide[] = [
  {
    slug: "how-to-read-gold-price",
    title: "How to read the gold price correctly",
    summary: "\"The price per gram\" can mean several things. We separate the world price from the shop price and show how to compare without getting confused.",
    minutes: 4,
    category: "gold",
    blocks: [
      {
        type: "p",
        text: "When someone asks \"What's gold today?\", you need to ask back: which karat? Per gram or per gold pound? Is that a selling price or a buying price? The same words cover different numbers, and most of the confusion in the market starts here.",
      },
      { type: "h", text: "How the price is quoted" },
      {
        type: "ul",
        items: [
          "Price per gram for each karat: the most common in shops, quoted for 24k, 21k and 18k.",
          "Price of the gold pound: a coin weighing 8 grams of 21k, so its price is the 21k gram price multiplied by 8.",
          "Price of the ounce: the unit of the world market, about 31.1 grams of 24k, priced in US dollars.",
        ],
      },
      { type: "h", text: "The world price (spot)" },
      {
        type: "p",
        text: "Gold trades around the world in US dollars per ounce. To get the price of a gram of 24k in Egyptian pounds with no extras, you do two steps: convert the ounce price from dollars to pounds using the dollar rate, then divide by the number of grams in an ounce. The result is the reference price we show here on Tas3era.",
      },
      {
        type: "p",
        text: "The useful part is that this number moves with only two things: the world ounce price, and the dollar rate against the pound. So gold can rise in pounds even when the ounce is flat, if the dollar is what went up, and the other way round.",
      },
      { type: "h", text: "Why the shop price is different" },
      {
        type: "p",
        text: "A shop sells above the reference price because it has costs and a profit margin, and making charges are added to worked pieces. When you sell to the shop, it buys from you at a lower price. The gap between a dealer's selling price and buying price is called the spread, and it varies from shop to shop and from time to time.",
      },
      { type: "h", text: "How to use the reference number" },
      {
        type: "ul",
        items: [
          "Decide the karat and weight you plan to buy, and work out the value of the gold itself with the calculator.",
          "Ask the shop for the price per gram and the making charge separately, and don't accept a single bundled number.",
          "Compare what the shop asks with the reference number. The difference is what you actually pay on top of the gold's value.",
          "Compare more than one shop on the same day, because prices move during the day.",
        ],
      },
      { type: "h", text: "Practical notes" },
      {
        type: "p",
        text: "The world price updates throughout trading hours, but our figures are recorded once a day, so don't use them to time a purchase to the minute. They are better for following the trend, comparing days and months with each other, and checking that what the shop tells you is not far from reasonable.",
      },
      {
        type: "note",
        text: "The numbers here are reference figures calculated from the world market, not an actual selling or buying price. Ask the shop for its current price before any decision.",
      },
    ],
    links: [
      { href: "/gold", label: "Gold prices and gold calculator" },
      { href: "/gold/21", label: "21k price" },
      { href: "/methodology", label: "How we calculate prices" },
      { href: "/glossary", label: "Glossary" },
    ],
  },
  {
    slug: "gold-karats-explained",
    title: "Karats: what 24, 21, 18 and 14 mean",
    summary: "A karat measures purity. We explain the math simply, why 21k is the common one, and how to compare two karats.",
    minutes: 4,
    category: "gold",
    blocks: [
      {
        type: "p",
        text: "A karat simply says how many parts out of 24 are gold in the piece. 24k means 24 parts out of 24: pure gold, or very close to it. 21k means 21 parts gold and the rest other metals. The bigger the number, the higher the purity.",
      },
      { type: "h", text: "The math" },
      {
        type: "ul",
        items: [
          "24k: 24 ÷ 24, so practically full purity.",
          "21k: 21 ÷ 24, which means 87.5% gold.",
          "18k: 18 ÷ 24, which means 75% gold.",
          "14k: 14 ÷ 24, which means about 58.3% gold.",
        ],
      },
      {
        type: "p",
        text: "So the price per gram of any karat is the 24k gram price multiplied by its purity share. An illustrative example with hypothetical numbers, not real prices: if a gram of 24k is 1,000 pounds, then 21k is about 875 and 18k is about 750. We calculate every karat on the gold page the same way.",
      },
      { type: "h", text: "Why not all jewelry is 24k" },
      {
        type: "p",
        text: "Pure gold is a soft metal that bends and scratches easily. It is mixed with other metals such as copper and silver so it is harder and can handle everyday wear, and the color of the mix also changes with the added metal. That is why rings and chains worn every day are usually below 24k.",
      },
      { type: "h", text: "Why 21k is popular in Egypt" },
      {
        type: "p",
        text: "21k is the best-known karat for worked pieces and for the gold pound in the Egyptian market, because it combines high purity with reasonable hardness. But no single karat is the best for everyone. Lower karats such as 18k and 14k are cheaper and harder, and they are used more in fine designs that hold stones.",
      },
      { type: "h", text: "The gold pound, half pound and ounce" },
      {
        type: "ul",
        items: [
          "Gold pound: 8 grams of 21k.",
          "Half pound: 4 grams of 21k.",
          "Ounce: about 31.1 grams of 24k, the unit of the world market.",
        ],
      },
      {
        type: "p",
        text: "These weights are fixed once, so you can work out any of them if you know the 24k gram price: multiply by the purity share, then by the number of grams.",
      },
      { type: "h", text: "How to check the karat" },
      {
        type: "ul",
        items: [
          "Look for the stamp engraved on the piece. It shows the karat.",
          "Ask for an invoice that states the karat and the exact weight.",
          "If the piece has stones, ask about the weight of the stones, because it is deducted from the weight of the gold.",
        ],
      },
      {
        type: "note",
        text: "If the piece has no clear stamp or the shop can't prove the karat, treat that as reason enough to walk away from the purchase.",
      },
    ],
    links: [
      { href: "/gold", label: "All karats and gold calculator" },
      { href: "/gold/21", label: "21k" },
      { href: "/gold/pound", label: "Gold pound" },
      { href: "/glossary", label: "Glossary" },
    ],
  },
  {
    slug: "making-charges-and-hallmark",
    title: "Making charges and hallmark: what you pay on top of the gold price",
    summary: "The gap between the value of the gold itself and the shop price of a piece is the making charge and some other costs. We explain how to ask and how to work it out.",
    minutes: 4,
    category: "gold",
    blocks: [
      {
        type: "p",
        text: "When you buy a worked piece you pay for two things: the gold in it, and the work that went into it. The first is set by the market, the weight of the piece and its karat. The second is called the making charge, and it varies from shop to shop and from piece to piece.",
      },
      { type: "h", text: "The making charge" },
      {
        type: "p",
        text: "The making charge covers manufacturing, design and the shop's margin. It can be calculated as a fixed amount per gram or as a percentage of the gold's value, and shops differ on this. There is no single figure we can give you here, and don't accept a line like \"that's the usual price\" without seeing the calculation written down.",
      },
      {
        type: "p",
        text: "In general, simpler designs carry a lower making charge than complex or very detailed ones. Bars and gold coins usually carry a lower making charge than worked pieces, because there is less work in them, but that also varies between dealers, so ask.",
      },
      { type: "h", text: "The hallmark" },
      {
        type: "p",
        text: "The hallmark is an official stamp engraved on the piece that certifies the karat. It is the most important way to prove that what you are buying really has the stated karat. A piece without a clear hallmark is hard to prove later, when you want to sell it or have it tested.",
      },
      { type: "h", text: "When you come to sell" },
      {
        type: "p",
        text: "This is the point many people are surprised by: the shop buys gold from you on the basis of its weight and karat only. The making charge you paid at purchase is usually not refunded in full, which means the price of gold has to rise a bit before a worked piece breaks even with what you paid. The policy differs from shop to shop, so ask before you buy: if I sell this piece back to you after a while, how will it be valued?",
      },
      { type: "h", text: "Ask before you pay" },
      {
        type: "ul",
        items: [
          "Today's price per gram for the piece's karat, separate from the making charge.",
          "How the making charge is calculated: per gram or a percentage?",
          "The actual weight of the piece on a scale in front of you, and the weight of any stones in it.",
          "The return and exchange policy, and whether the making charge is deducted.",
          "The invoice should state the karat, weight, price per gram and making charge, each on its own.",
        ],
      },
      { type: "h", text: "Work it out yourself" },
      {
        type: "p",
        text: "Open the gold calculator, enter the weight and karat, and you will see the value of the gold at the reference price. Then subtract that number from the price the shop is asking. The difference includes the making charge, the shop's margin and any other costs. If the difference looks large, ask for the details, or compare with another shop.",
      },
      {
        type: "note",
        text: "The figures on our site are reference figures and include no making charge, hallmark fee or taxes. The gold calculator lets you enter an estimated making-charge percentage of your own, but the actual number is set by the shop.",
      },
    ],
    links: [
      { href: "/gold", label: "Gold calculator" },
      { href: "/gold/pound", label: "Gold pound" },
      { href: "/methodology", label: "Methodology" },
      { href: "/glossary", label: "Glossary" },
    ],
  },
  {
    slug: "mid-market-vs-bank-rate",
    title: "Reference rate vs bank rate: the difference and why it matters",
    summary: "The number you see on websites is not always the number you will be charged. We explain the difference between the midpoint and the buy and sell prices.",
    minutes: 4,
    category: "currency",
    blocks: [
      {
        type: "p",
        text: "Any business that deals in currency, whether a bank or an exchange office, has two prices: one at which it buys currency from you, and one at which it sells currency to you. The two are not equal, and the gap between them is the business's profit and the cost of the service.",
      },
      { type: "h", text: "What the reference rate (mid-market) is" },
      {
        type: "p",
        text: "It is the price halfway between the buy price and the sell price in the market. It is the closest thing to the \"true value\" of a currency at that moment, before any business adds its margin. This is the rate used by news sites and financial references, and it is the one we show on Tas3era.",
      },
      { type: "h", text: "What happens when you go to the bank" },
      {
        type: "p",
        text: "A bank or exchange office will buy from you at a price below the reference rate and sell to you at a price above it. The gap differs by provider, by currency, by time and sometimes by amount. This is not a mistake. It is how the market works.",
      },
      {
        type: "ul",
        items: [
          "Buy price: what the bank pays when it buys foreign currency from you.",
          "Sell price: what you pay when you buy foreign currency from it.",
          "Spread: the difference between the two prices.",
          "Commissions and fees: may be added on top of the rate in some transactions.",
        ],
      },
      { type: "h", text: "An illustrative example" },
      {
        type: "p",
        text: "With hypothetical numbers, for illustration only: if the reference rate of a currency is 100, a provider might buy from you at 99 and sell to you at 101. If you buy and then sell straight away, you lose the difference even though the market hasn't moved at all. The smaller the spread, the lower the cost of the deal.",
      },
      { type: "h", text: "Why the numbers here differ from what you pay" },
      {
        type: "ul",
        items: [
          "We show the midpoint, not a buy or sell price.",
          "Our figures are recorded once a day, while the market moves during the day.",
          "Local providers may price differently from the world market, and may add fees and commissions.",
          "Card payments abroad are charged at a rate set by the card issuer, and fees may be added.",
        ],
      },
      { type: "h", text: "How to make use of the reference rate" },
      {
        type: "p",
        text: "Use it as a yardstick: if a provider quotes a rate far from it, ask why, and compare with other providers. It is also useful for following the trend: is the currency rising or falling over weeks, without being distracted by differences at a single moment.",
      },
      {
        type: "note",
        text: "No number on Tas3era represents a bank, exchange office or parallel-market rate. Check the actual rate with the provider you will deal with before you convert.",
      },
    ],
    links: [
      { href: "/currency/usd", label: "Dollar price" },
      { href: "/convert", label: "Currency converter" },
      { href: "/methodology", label: "Methodology" },
      { href: "/glossary", label: "Glossary" },
    ],
  },
  {
    slug: "what-moves-the-egyptian-pound",
    title: "What moves the Egyptian pound",
    summary: "There is no single reason. We lay out the general factors that affect any currency, and how to read a move without making predictions.",
    minutes: 5,
    category: "basics",
    blocks: [
      {
        type: "p",
        text: "The price of any currency against another is, at its core, a result of supply and demand. If demand for dollars is bigger than the supply, the dollar's price in pounds goes up. If it's the other way round, it goes down. The real question is: what increases the demand or the supply?",
      },
      { type: "h", text: "Sources of foreign currency" },
      {
        type: "p",
        text: "A country receives foreign currency from well-known sources. Any rise or fall in them affects supply.",
      },
      {
        type: "ul",
        items: [
          "Exports: when we sell goods and services abroad.",
          "Tourism: tourists bring foreign currency and exchange it.",
          "Remittances from workers abroad.",
          "Suez Canal revenues.",
          "Foreign investment, whether direct or in financial instruments.",
        ],
      },
      { type: "h", text: "Sources of demand for foreign currency" },
      {
        type: "ul",
        items: [
          "Imports: goods, raw materials and energy that are bought in dollars.",
          "Paying external debts and interest.",
          "Individuals' travel and study abroad.",
          "People and companies wanting to keep their savings in another currency.",
        ],
      },
      { type: "h", text: "Broader factors" },
      {
        type: "p",
        text: "There is another layer on top of direct supply and demand. Interest rates affect how attractive it is to hold pounds compared with other currencies. Inflation reduces a currency's purchasing power over time. And the strength of the dollar worldwide affects all currencies, not just the pound: when the dollar strengthens against the world, most currencies weaken against it.",
      },
      {
        type: "p",
        text: "Global investor mood matters too. In anxious times money moves to assets seen as safer, and that affects emerging markets in general.",
      },
      { type: "h", text: "The exchange-rate regime" },
      {
        type: "p",
        text: "There is a big difference between a currency whose price is set freely in the market and one whose price the state heavily influences. The regime in place changes the way moves happen: they can be gradual day by day, or jumps when the regime itself changes. We need to keep that in mind when reading price history.",
      },
      { type: "h", text: "How to read a move" },
      {
        type: "ul",
        items: [
          "Look at different periods: a week, a month and a year, not just today.",
          "Compare the move with other currencies: if every currency moved against the pound, the cause is the pound. If only the dollar did, it may be a global factor.",
          "Remember that a move that has happened won't necessarily continue.",
        ],
      },
      {
        type: "p",
        text: "The Movers page on Tas3era shows all currencies and gold ranked by change, so it helps you make that comparison quickly.",
      },
      {
        type: "note",
        text: "This page is a general explanation of known factors, not an analysis or a forecast of a future price. Nobody can predict an exchange rate with certainty.",
      },
    ],
    links: [
      { href: "/movers", label: "Who went up, who went down" },
      { href: "/currency/usd", label: "Dollar price" },
      { href: "/methodology", label: "Methodology" },
      { href: "/glossary", label: "Glossary" },
    ],
  },
  {
    slug: "convert-currency-right",
    title: "How to convert currencies correctly",
    summary: "Converting amounts looks easy until you fall into the unit or direction trap. A checklist to run through before you rely on any number.",
    minutes: 3,
    category: "currency",
    blocks: [
      {
        type: "p",
        text: "Converting between two currencies is a simple multiplication or division, but mistakes happen in the details: the direction of the conversion, the quote unit, and the day the rate was taken from. We'll go through each point.",
      },
      { type: "h", text: "Direction of the conversion" },
      {
        type: "p",
        text: "The rate shown on Tas3era is how many pounds one unit of the currency is worth. So to convert from the foreign currency to pounds, you multiply the amount by the rate. To convert from pounds to the currency, you divide the amount by the rate. The most common mistake is multiplying in the wrong direction, and the fix is to ask yourself: does the result make sense? If you convert an amount in pounds into a currency that is worth more than a pound, the number should get smaller.",
      },
      { type: "h", text: "The quote unit" },
      {
        type: "p",
        text: "Not every currency is quoted per single unit. The Japanese yen and the Indian rupee are quoted per 100 units, the way exchange offices quote them. If you calculate by hand, divide by 100 first to get the price of one unit. The converter on the site does this automatically.",
      },
      { type: "h", text: "Converting between two foreign currencies" },
      {
        type: "p",
        text: "If you want to know how many Saudi riyals a Kuwaiti dinar is worth, there's no need to go through the pound yourself. We calculate it by dividing the pound price of one currency by the other. That gives a cross rate. The converter supports any two currencies in the list.",
      },
      { type: "h", text: "Pay attention to the day" },
      {
        type: "p",
        text: "The rate you calculate with is the rate of the latest day we have, not the moment of your transaction. If you are working out an amount you will pay or receive, go back to the provider you will deal with and take the actual rate from them.",
      },
      { type: "h", text: "Costs that don't show up in the calculation" },
      {
        type: "ul",
        items: [
          "The gap between the provider's buy price and sell price.",
          "A transfer or exchange commission.",
          "Card fees if you pay in a currency other than the card's currency.",
          "Correspondent bank fees on international transfers.",
        ],
      },
      { type: "h", text: "A quick checklist before you rely on a number" },
      {
        type: "ul",
        items: [
          "Is the direction right?",
          "Is the unit right (1 or 100)?",
          "Which day was this rate taken from?",
          "Will the provider charge me the same rate or a different one?",
          "Are there fees that will be added?",
        ],
      },
      {
        type: "note",
        text: "The converter uses the reference rate, which is not a bank rate. The final number you deal with comes from the provider.",
      },
    ],
    links: [
      { href: "/convert", label: "Currency converter" },
      { href: "/currency/usd", label: "Dollar price" },
      { href: "/movers", label: "Movers" },
      { href: "/glossary", label: "Glossary" },
    ],
  },
  {
    slug: "gold-or-dollar-for-saving",
    title: "Gold or dollars for saving: an educational comparison",
    summary: "Each choice has benefits, costs and risks. We compare the characteristics themselves without telling you which to pick.",
    minutes: 5,
    category: "basics",
    blocks: [
      {
        type: "note",
        text: "This page is educational. It is not financial advice or a recommendation to buy or sell. Your decision depends on your circumstances, goals and time horizon, and you may need a professional.",
      },
      {
        type: "p",
        text: "A common question: should I convert my savings to dollars or buy gold? There is no single answer that is right for everyone. What we can do is lay out the basic characteristics of each choice, so you ask the right questions.",
      },
      { type: "h", text: "The dollar" },
      {
        type: "ul",
        items: [
          "Its price in pounds moves with the pound's movement against the dollar.",
          "It can be held in a bank account in a foreign currency, and some accounts pay a return depending on the bank's terms.",
          "It is easy to transfer and to pay with abroad.",
          "Its own purchasing power in dollar terms is affected by inflation in the United States.",
          "The gap between the buy price and the sell price sets the cost of getting in and out.",
          "The rules for dealing in it and the limits change, so check the current terms with the bank.",
        ],
      },
      { type: "h", text: "Gold" },
      {
        type: "ul",
        items: [
          "It is priced worldwide in dollars, so its price in pounds moves because of two things: the ounce price, and the dollar's rate against the pound.",
          "It pays no regular return. Its value comes only from changes in its price.",
          "It needs safe storage, and with physical purchases there is a cost for keeping and insuring it.",
          "If you buy worked pieces, the making charge is usually not refunded when you sell.",
          "The gap between a dealer's buy price and sell price affects your profit or loss.",
          "Its price moves up and down, sometimes sharply.",
        ],
      },
      { type: "h", text: "The comparison" },
      {
        type: "p",
        text: "Both are affected by the dollar, but in different ways. The dollar moves directly with the pound's movement against it. Gold moves with the world ounce price multiplied by the dollar's price in pounds. That means they can move in different directions over a given period, depending on what is happening in each market.",
      },
      {
        type: "p",
        text: "And neither guarantees a profit. The prices of both can fall. What is certain is the costs: the spread, the making charge and the fees, and their effect is more visible if you go in and out over short periods.",
      },
      { type: "h", text: "Questions to ask yourself" },
      {
        type: "ul",
        items: [
          "When will I need the money? In months or in years?",
          "Could I live with it if the price dropped just when I need the money?",
          "Might I need to spend part of it suddenly? And is this choice easy to sell?",
          "How much will I pay in entry and exit costs compared with the amount?",
          "Do I put the whole amount in one place or spread it?",
        ],
      },
      { type: "h", text: "How to use Tas3era here" },
      {
        type: "p",
        text: "You can compare the movement of the dollar and gold over the same period on the Movers page, and view history up to a year. History shows what happened, but it doesn't guarantee what will happen.",
      },
    ],
    links: [
      { href: "/movers", label: "Compare movement" },
      { href: "/currency/usd", label: "Dollar price" },
      { href: "/gold", label: "Gold price" },
      { href: "/glossary", label: "Glossary" },
    ],
  },
];
