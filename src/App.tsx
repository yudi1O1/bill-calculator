import { BasketSummary } from "./components/BasketSummary";
import { OfferList } from "./components/OfferList";
import { ProductCatalog } from "./components/ProductCatalog";

const App = () => {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col px-4 py-6 sm:px-6 sm:py-8">
      <section className="border border-slate-300 bg-white p-6">
        <div className="max-w-[840px]">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-600">
            React + Redux Toolkit + TypeScript
          </p>
          <h1 className="max-w-[18ch] text-4xl leading-[1.12] font-semibold text-slate-900 sm:text-5xl">
            Shopping basket bill calculator
          </h1>
          <p className="mt-3 max-w-[640px] text-base text-slate-700">
            Select products, see the subtotal before discounts, review each offer
            saving, and get the final payable amount instantly.
          </p>
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
