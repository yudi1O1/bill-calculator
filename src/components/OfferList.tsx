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
  <section className="panel">
    <div className="panel__header">
      <div>
        <p className="eyebrow">Promotions</p>
        <h2>Special offers</h2>
      </div>
    </div>

    <div className="offer-list">
      {offers.map((offer) => (
        <article className="offer-card" key={offer.title}>
          <span className="pill pill--light">{offer.badge}</span>
          <h3>{offer.title}</h3>
          <p>{offer.description}</p>
        </article>
      ))}

      <div className="offer-card offer-card--note">
        <span className="pill pill--success">Prices</span>
        <p>Bread {formatCurrency(1.1)}</p>
        <p>Milk {formatCurrency(0.5)}</p>
        <p>Cheese {formatCurrency(0.9)}</p>
        <p>Soup {formatCurrency(0.6)}</p>
        <p>Butter {formatCurrency(1.2)}</p>
      </div>
    </div>
  </section>
);
