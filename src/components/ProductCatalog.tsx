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
    <section className="panel">
      <div className="panel__header">
        <div>
          <p className="eyebrow">Store selection</p>
          <h2>Products</h2>
        </div>
        <span className="pill">5 items</span>
      </div>

      <div className="catalog-grid">
        {products.map((product) => (
          <article
            className="product-card"
            key={product.id}
            style={{ "--accent": product.accent } as CSSProperties}
          >
            <div className="product-card__top">
              <div>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
              </div>
              <span className="product-card__price">
                {formatCurrency(product.price)}
              </span>
            </div>

            <div className="product-card__footer">
              <span className="product-card__meta">
                In basket: {quantityMap[product.id] ?? 0}
              </span>
              <button
                className="action-button"
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
