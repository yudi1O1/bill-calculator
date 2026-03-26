import { formatCurrency } from "../utils/currency";

const offers = [
  {
    title: "Cheese offer",
    description: "Buy one cheese and get one free.",
  },
  {
    title: "Soup and bread",
    description: "Each soup gives one bread at a lower price.",
  },
  {
    title: "Butter deal",
    description: "Each butter gets a discount.",
  },
];

export const OfferList = () => (
  <section className="border border-slate-300 bg-white p-5">
    <div className="mb-5">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-600">
          Promotions
        </p>
        <h2 className="text-2xl font-semibold text-slate-900">Special offers</h2>
      </div>
    </div>

    <div className="grid gap-4">
      {offers.map((offer) => (
        <article
          className="border border-slate-300 bg-white p-4"
          key={offer.title}
        >
          <h3 className="text-xl font-semibold text-slate-900">{offer.title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">{offer.description}</p>
        </article>
      ))}

      <div className="border border-slate-300 bg-white p-4 text-left">
        <span className="inline-flex items-center justify-center border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700">
          Prices
        </span>
        <div className="mt-3 space-y-1 text-left text-lg text-slate-600">
          <p className="flex items-center justify-between gap-6">
            <span>Bread</span>
            <span>{formatCurrency(1.1)}</span>
          </p>
          <p className="flex items-center justify-between gap-6">
            <span>Milk</span>
            <span>{formatCurrency(0.5)}</span>
          </p>
          <p className="flex items-center justify-between gap-6">
            <span>Cheese</span>
            <span>{formatCurrency(0.9)}</span>
          </p>
          <p className="flex items-center justify-between gap-6">
            <span>Soup</span>
            <span>{formatCurrency(0.6)}</span>
          </p>
          <p className="flex items-center justify-between gap-6">
            <span>Butter</span>
            <span>{formatCurrency(1.2)}</span>
          </p>
        </div>
      </div>
    </div>
  </section>
);
