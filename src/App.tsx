import { BasketSummary } from "./components/BasketSummary";
import { OfferList } from "./components/OfferList";
import { ProductCatalog } from "./components/ProductCatalog";

const App = () => {
  return (
    <main className="page-shell">
      <section className="panel panel-body-lg">
        <div className="max-w-[840px]">
          <p className="section-label">
            React + Redux Toolkit + TypeScript
          </p>
          <h1 className="max-w-[18ch] text-4xl leading-[1.12] font-semibold text-slate-900 sm:text-5xl">
            Shopping basket bill calculator
          </h1>
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_0.95fr]">
        <ProductCatalog />
        <OfferList />
      </section>

      <BasketSummary />
    </main>
  );
};

export default App;
