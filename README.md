# Shopping Basket Bill Calculator

A React + Redux Toolkit + TypeScript assignment project that lets a user select products, view the basket, and calculate the final bill after applying special offers.

## Tech stack

- React
- Redux Toolkit
- TypeScript
- Vite
- Vitest

## Features

- Add and remove products from the basket
- View subtotal before applying offers
- Show each applied offer with individual savings
- Show total savings and final total
- Save basket data in Firebase Firestore
- Load saved basket data from Firebase Firestore
- Responsive, polished UI



## Run locally

```bash
npm install
npm run dev
```

## Firebase setup

Create local `.env.local` file and add the Firebase web app configuration:

```env
FIREBASE_API_KEY=...
FIREBASE_AUTH_DOMAIN=...
FIREBASE_PROJECT_ID=...
FIREBASE_STORAGE_BUCKET=...
FIREBASE_MESSAGING_SENDER_ID=...
FIREBASE_APP_ID=...
FIREBASE_MEASUREMENT_ID=...
FIREBASE_BASKET_DOC_ID=default-basket
```

Firestore is used to save and load basket data.

## Verify

```bash
npm test
npm run build
```

## Deployment

Deployment works with Vercel.

## Notes

- Firebase configuration is handled with local environment variables.
- Firestore stores the saved basket items.
- `dist` is the production build output directory.
