import { useEffect, useState } from "react";
import {
  clearBasket,
  addItem,
  removeItem,
  selectBasketCount,
  selectBasketItems,
  selectCheckoutSummary,
  setBasket,
} from "../features/basket/basketSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { firebaseConfigError, isFirebaseConfigured } from "../lib/firebase";
import {
  loadBasketFromFirestore,
  saveBasketToFirestore,
} from "../services/basketPersistence";
import { formatCurrency } from "../utils/currency";

export const BasketSummary = () => {
  const dispatch = useAppDispatch();
  const itemCount = useAppSelector(selectBasketCount);
  const basketItems = useAppSelector(selectBasketItems);
  const summary = useAppSelector(selectCheckoutSummary);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(
    isFirebaseConfigured ? null : firebaseConfigError,
  );
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      return;
    }

    let isMounted = true;

    const hydrateBasket = async () => {
      setIsLoading(true);
      setStatusMessage("Loading basket from Firebase...");

      try {
        const snapshot = await loadBasketFromFirestore();

        if (!isMounted) {
          return;
        }

        if (snapshot) {
          dispatch(setBasket(snapshot.items));
          setLastSyncedAt(snapshot.savedAt);
          setStatusMessage("Basket loaded from Firebase.");
        } else {
          setStatusMessage("Firebase is connected. Save the basket to create the first record.");
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setStatusMessage(
          error instanceof Error ? error.message : "Unable to load basket from Firebase.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void hydrateBasket();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  const handleSaveBasket = async () => {
    setIsSaving(true);
    setStatusMessage("Saving basket to Firebase...");

    try {
      const savedAt = await saveBasketToFirestore(basketItems);
      setLastSyncedAt(savedAt);
      setStatusMessage("Basket saved to Firebase.");
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : "Unable to save basket to Firebase.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadBasket = async () => {
    setIsLoading(true);
    setStatusMessage("Refreshing basket from Firebase...");

    try {
      const snapshot = await loadBasketFromFirestore();

      if (snapshot) {
        dispatch(setBasket(snapshot.items));
        setLastSyncedAt(snapshot.savedAt);
        setStatusMessage("Basket refreshed from Firebase.");
      } else {
        setStatusMessage("No basket document found in Firebase yet.");
      }
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : "Unable to refresh basket from Firebase.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formattedLastSyncedAt = lastSyncedAt
    ? new Intl.DateTimeFormat("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(lastSyncedAt))
    : null;

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

      <div className="sync-card">
        <div className="sync-card__header">
          <div>
            <p className="eyebrow">Firebase</p>
            <h3>Basket persistence</h3>
          </div>
          <div className="sync-card__actions">
            <button
              className="ghost-button"
              type="button"
              onClick={() => void handleLoadBasket()}
              disabled={!isFirebaseConfigured || isLoading}
            >
              {isLoading ? "Loading..." : "Load"}
            </button>
            <button
              className="action-button"
              type="button"
              onClick={() => void handleSaveBasket()}
              disabled={!isFirebaseConfigured || isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        <p className="sync-card__status">{statusMessage || "Firebase is ready."}</p>

        {formattedLastSyncedAt ? (
          <p className="sync-card__meta">Last synced: {formattedLastSyncedAt}</p>
        ) : null}
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
