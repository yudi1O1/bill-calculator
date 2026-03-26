import { BasketSummary } from "./components/BasketSummary";
import { OfferList } from "./components/OfferList";
import { ProductCatalog } from "./components/ProductCatalog";

const App = () => {
  return (
    <main className="mx-auto flex w-full max-w-[1180px] flex-col px-4 py-8 sm:px-6 sm:py-10">
      <section className="rounded-[28px] border border-slate-200/70 bg-white/85 p-7 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <div className="max-w-[840px]">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.08em] text-blue-600">
            React + Redux Toolkit + TypeScript
          </p>
          <h1 className="max-w-[18ch] text-4xl leading-[1.12] font-semibold text-slate-900 sm:text-5xl">
            Shopping basket bill calculator
          </h1>
          <p className="mt-3 max-w-[640px] text-base text-slate-600">
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
