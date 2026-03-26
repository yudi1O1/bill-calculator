import { formatCurrency } from "../utils/currency";

const offers = [
  {
    title: "Cheese offer",
    description: "Buy one cheese and get the second cheese free.",
    badge: "BOGO",
  },
  {
    title: "Soup and bread",
    description: "Each soup gives one bread at half price.",
    badge: "50% OFF",
  },
  {
    title: "Butter deal",
    description: "Every butter receives a one-third discount.",
    badge: "33% OFF",
  },
];

export const OfferList = () => (
  <section className="rounded-3xl border border-slate-200/70 bg-white/85 p-6 shadow-[0_18px_34px_rgba(15,23,42,0.06)] backdrop-blur-xl">
    <div className="mb-5">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.08em] text-blue-600">
          Promotions
        </p>
        <h2 className="text-3xl font-semibold text-slate-900">Special offers</h2>
      </div>
    </div>

    <div className="grid gap-4">
      {offers.map((offer) => (
        <article
          className="rounded-[20px] border border-orange-200/70 bg-linear-to-br from-orange-50 to-white p-[18px]"
          key={offer.title}
        >
          <span className="inline-flex items-center justify-center rounded-full bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700">
            {offer.badge}
          </span>
          <h3 className="mt-3 text-xl font-semibold text-slate-900">{offer.title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-500">{offer.description}</p>
        </article>
      ))}

      <div className="rounded-[20px] border border-emerald-200/70 bg-linear-to-br from-emerald-50 to-white p-[18px]">
        <span className="inline-flex items-center justify-center rounded-full bg-emerald-100 px-3 py-2 text-xs font-bold text-emerald-700">
          Prices
        </span>
        <div className="mt-3 space-y-1 text-lg text-slate-500">
          <p>Bread {formatCurrency(1.1)}</p>
          <p>Milk {formatCurrency(0.5)}</p>
          <p>Cheese {formatCurrency(0.9)}</p>
          <p>Soup {formatCurrency(0.6)}</p>
          <p>Butter {formatCurrency(1.2)}</p>
        </div>
      </div>
    </div>
  </section>
);
