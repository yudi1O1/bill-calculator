import { offers } from "../data/offers";

export const OfferList = () => (
  <section className="panel panel-body">
    <div className="mb-5">
      <div>
        <p className="section-label">
          Promotions
        </p>
        <h2 className="section-title">Special offers</h2>
      </div>
    </div>

    <div className="grid gap-4">
      {/* offer section */}
      {offers.map((offer) => (
        <article
          className="item-card"
          key={offer.title}
        >
          <h3 className="text-xl font-semibold text-slate-900">
            {offer.title}
          </h3>
          <p className="mt-1 text-sm leading-6 muted-text">
            {offer.description}
          </p>
        </article>
      ))}

      <div className="item-card text-left">
        <span className="inline-flex items-center justify-center border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700">
          Prices
        </span>
        <div className="mt-3 space-y-1 text-left text-lg muted-text">
          <p className="summary-row">
            <span>Bread</span>
            <span>$1.10</span>
          </p>
          <p className="summary-row">
            <span>Milk</span>
            <span>$0.50</span>
          </p>
          <p className="summary-row">
            <span>Cheese</span>
            <span>$0.90</span>
          </p>
          <p className="summary-row">
            <span>Soup</span>
            <span>$0.60</span>
          </p>
          <p className="summary-row">
            <span>Butter</span>
            <span>$1.20</span>
          </p>
        </div>
      </div>
    </div>
  </section>
);
