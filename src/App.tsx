import { BasketSummary } from "./components/BasketSummary";
import { OfferList } from "./components/OfferList";
import { ProductCatalog } from "./components/ProductCatalog";

const App = () => {
  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">React + Redux Toolkit + TypeScript</p>
          <h1>Shopping basket bill calculator</h1>
          <p className="hero__text">
            Select products, see the subtotal before discounts, review each offer
            saving, and get the final payable amount instantly.
          </p>
        </div>
      </section>

      <section className="layout-grid">
        <ProductCatalog />
        <OfferList />
      </section>

      <BasketSummary />
    </main>
  );
};

export default App;
