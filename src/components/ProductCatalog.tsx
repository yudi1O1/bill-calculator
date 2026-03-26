import type { CSSProperties } from "react";
import { products } from "../data/products";
import { addItem, selectBasketItems } from "../features/basket/basketSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { formatCurrency } from "../utils/currency";

export const ProductCatalog = () => {
  const dispatch = useAppDispatch();
  const basketItems = useAppSelector(selectBasketItems);

  const quantityMap = Object.fromEntries(
    basketItems.map((item) => [item.productId, item.quantity]),
  );

  return (
    <section className="rounded-3xl border border-slate-200/70 bg-white/85 p-6 shadow-[0_18px_34px_rgba(15,23,42,0.06)] backdrop-blur-xl">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.08em] text-blue-600">
            Store selection
          </p>
          <h2 className="text-3xl font-semibold text-slate-900">Products</h2>
        </div>
        <span className="inline-flex items-center justify-center rounded-full bg-blue-100 px-3 py-2 text-xs font-bold text-blue-700">
          5 items
        </span>
      </div>

      <div className="grid gap-4">
        {products.map((product) => (
          <article
            className="rounded-[20px] border border-slate-200 bg-linear-to-b from-white to-slate-50 p-[18px]"
            key={product.id}
            style={{ borderLeft: `6px solid ${product.accent}` } as CSSProperties}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">{product.name}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">{product.description}</p>
              </div>
              <span className="shrink-0 whitespace-nowrap text-lg font-extrabold text-slate-950">
                {formatCurrency(product.price)}
              </span>
            </div>

            <div className="mt-[18px] flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm font-semibold text-slate-600">
                In basket: {quantityMap[product.id] ?? 0}
              </span>
              <button
                className="inline-flex items-center justify-center rounded-xl bg-linear-to-r from-blue-600 to-slate-900 px-4 py-2.5 font-semibold text-white shadow-[0_10px_18px_rgba(37,99,235,0.18)] transition hover:-translate-y-0.5"
                type="button"
                onClick={() => dispatch(addItem(product.id))}
              >
                Add
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
