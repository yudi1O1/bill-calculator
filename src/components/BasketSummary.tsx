import { useEffect, useState } from "react";
import {
  addItem,
  clearBasket,
  removeItem,
  selectBasketCount,
  selectBasketItems,
  selectBudget,
  selectCheckoutSummary,
  selectIsNearBudget,
  setBasket,
  setBudget,
} from "../features/basket/basketSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { firebaseConfigError, isFirebaseConfigured } from "../lib/firebase";
import {
  loadBasketFromFirestore,
  saveBasketToFirestore,
} from "../services/basketPersistence";

export const BasketSummary = () => {
  const dispatch = useAppDispatch();

  const itemCount = useAppSelector(selectBasketCount);
  const basketItems = useAppSelector(selectBasketItems);
  const summary = useAppSelector(selectCheckoutSummary);
  const isNearBudget = useAppSelector(selectIsNearBudget);
  const budget = useAppSelector(selectBudget);

  const [savingBasket, setSavingBasket] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    isFirebaseConfigured
      ? "Firebase is ready."
      : firebaseConfigError || "Firebase is not configured.",
  );

  const getErrorMessage = (error: unknown, fallbackMessage: string) => {
    if (error instanceof Error) {
      return error.message;
    }

    return fallbackMessage;
  };

  const loadBasket = async () => {
    setStatusMessage("Loading basket...");

    try {
      const savedBasket = await loadBasketFromFirestore();

      if (!savedBasket) {
        setStatusMessage("No basket document found.");
        return;
      }

      dispatch(setBasket(savedBasket.items));
      setStatusMessage("Basket loaded");
    } catch (error) {
      setStatusMessage(getErrorMessage(error, "Unable to load basket."));
    }
  };

  const handleSaveBasket = async () => {
    setSavingBasket(true);
    setStatusMessage("Saving basket...");

    try {
      await saveBasketToFirestore(basketItems);
      setStatusMessage("Basket saved.");
    } catch (error) {
      setStatusMessage(getErrorMessage(error, "Unable to save basket."));
    } finally {
      setSavingBasket(false);
    }
  };

  const handleBudgetChange = (value: string) => {
    const nextBudget = Number(value);
    dispatch(setBudget(Number.isFinite(nextBudget) ? nextBudget : 0));
  };

  const getOffersForItem = (productId: string) => {
    return summary.appliedOffers.filter(
      (offer) => offer.productId === productId,
    );
  };

  const getOfferSavings = (productId: string) => {
    const offers = getOffersForItem(productId);
    return offers.reduce((total, offer) => total + offer.savings, 0);
  };

  const willExceedBudget = (price: number) =>
    budget > 0 && summary.finalTotal + price > budget;

  useEffect(() => {
    if (!isFirebaseConfigured) {
      return;
    }

    void loadBasket();
  }, []);

  return (
    <>
      {isNearBudget ? (
        <p className="mb-3 text-red-500">
          Warning: you have reached 90% of your budget (${budget.toFixed(2)})
        </p>
      ) : null}

      <section className="panel panel-body mt-6">
        <div className="section-header">
          <div>
            <p className="section-label">Billing details</p>
            <h2 className="section-title">Basket</h2>
          </div>
          <button
            className="secondary-button"
            type="button"
            onClick={() => dispatch(clearBasket())}
            disabled={itemCount === 0}
          >
            Clear basket
          </button>
        </div>

        <input
          id="basket-budget"
          className="mb-5 w-full border-b border-slate-300 px-0 py-2 text-slate-900 "
          type="number"
          min="0"
          // step="0.01"
          placeholder="Enter your budget"
          value={budget === 0 ? "" : budget}
          onChange={(event) => handleBudgetChange(event.target.value)}
        />

        <div className="mb-5 border border-slate-300 bg-slate-50 p-4">
          <div className="card-top">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">
                Save Items
              </h3>
            </div>

            <div className="flex items-start gap-3">
              <button
                className="primary-button"
                type="button"
                onClick={() => void handleSaveBasket()}
                disabled={!isFirebaseConfigured || savingBasket}
              >
                {savingBasket ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-600">{statusMessage}</p>
        </div>

        {summary.lineItems.length === 0 ? (
          <div className="empty-state">
            <h3 className="text-xl font-semibold text-slate-900">
              No products selected
            </h3>
          </div>
        ) : (
          <>
            <div className="grid gap-4">
              {summary.lineItems.map((item) => {
                const lineOffers = getOffersForItem(item.product.id);
                const offerSavings = getOfferSavings(item.product.id);

                return (
                  <article className="item-card" key={item.product.id}>
                    <div className="card-top">
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900">
                          {item.product.name}
                        </h3>
                        <p className="muted-text">
                          ${item.product.price.toFixed(2)} x {item.quantity}
                        </p>
                      </div>

                      <div className="inline-flex items-center gap-2.5">
                        <button
                          className="count-button"
                          type="button"
                          onClick={() => dispatch(removeItem(item.product.id))}
                        >
                          -
                        </button>
                        <span className="min-w-7 text-center font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          className="count-button"
                          type="button"
                          onClick={() => dispatch(addItem(item.product.id))}
                          disabled={willExceedBudget(item.product.price)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="summary-row muted-text mt-3">
                      <span>Item subtotal</span>
                      <strong className="text-slate-950">
                        ${item.lineSubtotal.toFixed(2)}
                      </strong>
                    </div>

                    <div className="summary-row muted-text mt-3">
                      <span className="font-semibold text-slate-800">
                        Offer saving
                      </span>
                      <strong className="text-slate-900">
                        ${offerSavings.toFixed(2)}
                      </strong>
                    </div>

                    {lineOffers.length > 0 ? (
                      <div className="offer-list">
                        {lineOffers.map((offer) => (
                          <p key={offer.id}>{offer.title}</p>
                        ))}
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>

            <div className="summary-card">
              <h3 className="mb-4 text-xl font-semibold text-slate-900">
                Bill summary
              </h3>

              <div className="summary-row">
                <span>Subtotal before offers</span>
                <strong className="text-slate-900">
                  ${summary.subtotal.toFixed(2)}
                </strong>
              </div>

              <div className="mt-2 border-y border-slate-300 py-3">
                <p className="mb-2 text-red-600">Special offers applied</p>

                {summary.appliedOffers.length > 0 ? (
                  summary.appliedOffers.map((offer) => (
                    <div className="summary-row text-red-600" key={offer.id}>
                      <span>{offer.title}</span>
                      <strong className="text-red-700">
                        -${offer.savings.toFixed(2)}
                      </strong>
                    </div>
                  ))
                ) : (
                  <div className="summary-row muted-text">
                    <span>No offers matched this basket</span>
                    <strong className="text-slate-900">
                      ${(0).toFixed(2)}
                    </strong>
                  </div>
                )}
              </div>

              <div className="summary-row">
                <span>Total savings</span>
                <strong className="text-slate-900">
                  ${summary.totalSavings.toFixed(2)}
                </strong>
              </div>

              <div className="mt-2 flex items-center justify-between gap-4 border-t border-slate-300 pt-[18px] text-lg">
                <span>Final total</span>
                <strong className="text-slate-900">
                  ${summary.finalTotal.toFixed(2)}
                </strong>
              </div>
            </div>
          </>
        )}
      </section>
    </>
  );
};
