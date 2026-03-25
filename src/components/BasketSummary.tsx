import { clearBasket, addItem, removeItem, selectBasketCount, selectCheckoutSummary } from "../features/basket/basketSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { formatCurrency } from "../utils/currency";

export const BasketSummary = () => {
  const dispatch = useAppDispatch();
  const itemCount = useAppSelector(selectBasketCount);
  const summary = useAppSelector(selectCheckoutSummary);

  return (
    <section className="panel panel--summary">
      <div className="panel__header">
        <div>
          <p className="eyebrow">Billing details</p>
          <h2>Basket</h2>
        </div>
        <button
          className="ghost-button"
          type="button"
          onClick={() => dispatch(clearBasket())}
          disabled={itemCount === 0}
        >
          Clear basket
        </button>
      </div>

      {summary.lineItems.length === 0 ? (
        <div className="empty-state">
          <h3>No products selected</h3>
          <p>Add products from the left panel to generate the bill automatically.</p>
        </div>
      ) : (
        <>
          <div className="basket-lines">
            {summary.lineItems.map((item) => {
              const lineOffers = summary.appliedOffers.filter((offer) =>
                  (offer.id === "cheese-bogo" && item.product.id === "cheese") ||
                  (offer.id === "soup-bread" && item.product.id === "bread") ||
                  (offer.id === "butter-third-off" && item.product.id === "butter"),
                );

              const offerSavings = lineOffers.reduce((sum, offer) => sum + offer.savings, 0);

              return (
                <article className="basket-line" key={item.product.id}>
                  <div className="basket-line__main">
                    <div>
                      <h3>{item.product.name}</h3>
                      <p>
                        {formatCurrency(item.product.price)} x {item.quantity}
                      </p>
                    </div>

                    <div className="quantity-stepper">
                      <button
                        type="button"
                        onClick={() => dispatch(removeItem(item.product.id))}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => dispatch(addItem(item.product.id))}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="basket-line__meta">
                    <span>Item subtotal</span>
                    <strong>{formatCurrency(item.lineSubtotal)}</strong>
                  </div>

                  <div className="basket-line__meta basket-line__meta--saving">
                    <span>Offer saving</span>
                    <strong>{formatCurrency(offerSavings)}</strong>
                  </div>

                  {lineOffers.length > 0 ? (
                    <div className="basket-line__offers">
                      {lineOffers.map((offer) => (
                        <span className="pill pill--light" key={offer.id}>
                          {offer.badge}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>

          <div className="totals-card">
            <h3>Bill summary</h3>

            <div className="totals-row">
              <span>Subtotal before offers</span>
              <strong>{formatCurrency(summary.subtotal)}</strong>
            </div>

            <div className="offer-breakdown">
              <p>Special offers applied</p>
              {summary.appliedOffers.length > 0 ? (
                summary.appliedOffers.map((offer) => (
                  <div className="totals-row totals-row--saving" key={offer.id}>
                    <span className="offer-label">
                      <span className="pill pill--light">{offer.badge}</span>
                      <span>{offer.title}</span>
                    </span>
                    <strong>-{formatCurrency(offer.savings)}</strong>
                  </div>
                ))
              ) : (
                <div className="totals-row totals-row--muted">
                  <span>No offers matched this basket</span>
                  <strong>{formatCurrency(0)}</strong>
                </div>
              )}
            </div>

            <div className="totals-row">
              <span>Total savings</span>
              <strong className="text-success">{formatCurrency(summary.totalSavings)}</strong>
            </div>

            <div className="totals-row totals-row--grand">
              <span>Final total</span>
              <strong>{formatCurrency(summary.finalTotal)}</strong>
            </div>
          </div>
        </>
      )}
    </section>
  );
};
