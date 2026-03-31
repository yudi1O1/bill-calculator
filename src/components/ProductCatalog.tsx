import { products } from "../data/products";
import {
  addItem,
  selectBasketItems,
  selectCheckoutSummary,
  selectBudget,
} from "../features/basket/basketSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";

export const ProductCatalog = () => {
  const dispatch = useAppDispatch();
  const basketItems = useAppSelector(selectBasketItems);
  const summery = useAppSelector(selectCheckoutSummary);
const budget = useAppSelector(selectBudget);
  // quantiy in basket for each product
  const getQuantity = (productId: string) => {
    const basketItem = basketItems.find((item) => item.productId === productId);
    return basketItem?.quantity ?? 0;
  };

  return (
    <section className="panel panel-body">
      <div className="section-header">
        <div>
          <p className="section-label">
            Store selection
          </p>
          <h2 className="section-title">Products</h2>
        </div>
      </div>

      {/*product list */}

      <div className="grid gap-4">
        {products.map((product) => (
          <article
            className={`product-card ${product.accentClass}`}
            key={product.id}
          >
            <div className="card-top">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">
                  {product.name}
                </h3>
              </div>
              <span className="price-text">
                ${product.price.toFixed(2)}
              </span>
            </div>

            <div className="item-footer">
              <span className="small-strong-text">
                In basket: {getQuantity(product.id)}
              </span>
              <button
                disabled={budget>0 && summery.finalTotal + product.price > budget}
                className="primary-button"
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
