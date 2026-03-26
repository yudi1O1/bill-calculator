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
    <section className="border border-slate-300 bg-white p-5">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-600">
            Store selection
          </p>
          <h2 className="text-2xl font-semibold text-slate-900">Products</h2>
        </div>
        <span className="inline-flex items-center justify-center border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700">
          5 items
        </span>
      </div>

      <div className="grid gap-4">
        {products.map((product) => (
          <article
            className="border border-slate-300 bg-white p-4"
            key={product.id}
            style={{ borderLeft: `6px solid ${product.accent}` } as CSSProperties}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">{product.name}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">{product.description}</p>
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
                className="inline-flex items-center justify-center border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
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
