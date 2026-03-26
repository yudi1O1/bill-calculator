import { useEffect, useState } from "react";
import {
  addItem,
  clearBasket,
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

const primaryButtonClass =
  "inline-flex items-center justify-center border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-55";

function getStatusMessage(error: unknown, fallbackMessage: string) {
  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}

export const BasketSummary = () => {
  const dispatch = useAppDispatch();
  const itemCount = useAppSelector(selectBasketCount);
  const basketItems = useAppSelector(selectBasketItems);
  const summary = useAppSelector(selectCheckoutSummary);

  const [, setLoadingBasket] = useState(false);
  const [savingBasket, setSavingBasket] = useState(false);
  const [, setLastSyncedAt] = useState<string | null>(null);
  const [, setStatusMessage] = useState<string>(
    isFirebaseConfigured ? "Firebase is ready." : firebaseConfigError || "Firebase is not configured.",
  );

  const loadBasket = async (loadingMessage: string, successMessage: string) => {
    setLoadingBasket(true);
    setStatusMessage(loadingMessage);

    try {
      const savedBasket = await loadBasketFromFirestore();

      if (!savedBasket) {
        setStatusMessage("No basket document found in Firebase yet.");
        return;
      }

      dispatch(setBasket(savedBasket.items));
      setLastSyncedAt(savedBasket.savedAt);
      setStatusMessage(successMessage);
    } catch (error) {
      setStatusMessage(getStatusMessage(error, "Unable to load basket from Firebase."));
    } finally {
      setLoadingBasket(false);
    }
  };

  const handleSaveBasket = async () => {
    setSavingBasket(true);
    setStatusMessage("Saving basket to Firebase...");

    try {
      const savedAt = await saveBasketToFirestore(basketItems);
      setLastSyncedAt(savedAt);
      setStatusMessage("Basket saved to Firebase.");
    } catch (error) {
      setStatusMessage(getStatusMessage(error, "Unable to save basket to Firebase."));
    } finally {
      setSavingBasket(false);
    }
  };

  useEffect(() => {
    if (!isFirebaseConfigured) {
      return;
    }

    void loadBasket(
      "Loading basket from Firebase...",
      "Basket loaded from Firebase.",
    );
  }, []);

  return (
    <section className="mt-6 border border-slate-300 bg-white p-5">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-600">
            Billing details
          </p>
          <h2 className="text-2xl font-semibold text-slate-900">Basket</h2>
        </div>
        <button
          className="inline-flex items-center justify-center border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-55"
          type="button"
          onClick={() => dispatch(clearBasket())}
          disabled={itemCount === 0}
        >
          Clear basket
        </button>
      </div>

      <div className="mb-5 border border-slate-300 bg-slate-50 p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">Save Items</h3>
          </div>

          <div className="flex items-start gap-3">
            <button
              className={primaryButtonClass}
              type="button"
              onClick={() => void handleSaveBasket()}
              disabled={!isFirebaseConfigured || savingBasket}
            >
              {savingBasket ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>

      {summary.lineItems.length === 0 ? (
        <div className="border border-dashed border-slate-300 bg-white p-6">
          <h3 className="text-xl font-semibold text-slate-900">No products selected</h3>
          <p className="mt-2 text-slate-600">
            Add products from the left panel to generate the bill automatically.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            {summary.lineItems.map((item) => {
              const lineOffers = [];

              for (const offer of summary.appliedOffers) {
                if (offer.id === "cheese-bogo" && item.product.id === "cheese") {
                  lineOffers.push(offer);
                }

                if (offer.id === "soup-bread" && item.product.id === "bread") {
                  lineOffers.push(offer);
                }

                if (offer.id === "butter-third-off" && item.product.id === "butter") {
                  lineOffers.push(offer);
                }
              }

              let offerSavings = 0;

              lineOffers.forEach((offer) => {
                offerSavings += offer.savings;
              });

              return (
                <article
                  className="border border-slate-300 bg-white p-4"
                  key={item.product.id}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">{item.product.name}</h3>
                      <p className="text-slate-600">
                        {formatCurrency(item.product.price)} x {item.quantity}
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-2.5">
                      <button
                        className="flex h-[38px] w-[38px] items-center justify-center border border-slate-300 bg-white text-xl font-bold text-slate-700"
                        type="button"
                        onClick={() => dispatch(removeItem(item.product.id))}
                      >
                        -
                      </button>
                      <span className="min-w-7 text-center font-bold text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        className="flex h-[38px] w-[38px] items-center justify-center border border-slate-300 bg-white text-xl font-bold text-slate-700"
                        type="button"
                        onClick={() => dispatch(addItem(item.product.id))}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-4 text-slate-600">
                    <span>Item subtotal</span>
                    <strong className="text-slate-950">{formatCurrency(item.lineSubtotal)}</strong>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-4 text-slate-600">
                    <span className="font-semibold text-slate-800">Offer saving</span>
                    <strong className="text-slate-900">{formatCurrency(offerSavings)}</strong>
                  </div>

                  {lineOffers.length > 0 ? (
                    <div className="mt-3 space-y-1 text-sm text-red-600">
                      {lineOffers.map((offer) => (
                        <p key={offer.id}>{offer.title}</p>
                      ))}
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>

          <div className="mt-5 border border-slate-300 bg-slate-100 p-5 text-slate-800">
            <h3 className="mb-4 text-xl font-semibold text-slate-900">Bill summary</h3>

            <div className="flex items-center justify-between gap-4 py-2.5">
              <span>Subtotal before offers</span>
              <strong className="text-slate-900">{formatCurrency(summary.subtotal)}</strong>
            </div>

            <div className="mt-2 border-y border-slate-300 py-3">
              <p className="mb-2 text-red-600">Special offers applied</p>

              {summary.appliedOffers.length > 0 ? (
                summary.appliedOffers.map((offer) => (
                  <div
                    className="flex items-center justify-between gap-4 py-2.5 text-red-600"
                    key={offer.id}
                  >
                    <span>{offer.title}</span>
                    <strong className="text-red-700">-{formatCurrency(offer.savings)}</strong>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-between gap-4 py-2.5 text-slate-600">
                  <span>No offers matched this basket</span>
                  <strong className="text-slate-900">{formatCurrency(0)}</strong>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-4 py-2.5">
              <span>Total savings</span>
              <strong className="text-slate-900">{formatCurrency(summary.totalSavings)}</strong>
            </div>

            <div className="mt-2 flex items-center justify-between gap-4 border-t border-slate-300 pt-[18px] text-lg">
              <span>Final total</span>
              <strong className="text-slate-900">{formatCurrency(summary.finalTotal)}</strong>
            </div>
          </div>
        </>
      )}
    </section>
  );
};
