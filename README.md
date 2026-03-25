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
- Responsive, polished UI
- Unit tests for billing logic

## Product prices

- Bread: GBP 1.10
- Milk: GBP 0.50
- Cheese: GBP 0.90
- Soup: GBP 0.60
- Butter: GBP 1.20

## Special offers

- Buy one cheese, get one cheese free
- Buy soup and get bread at half price
- Butter gets one-third off

## Run locally

```bash
npm install
npm run dev
```

## Verify

```bash
npm test
npm run build
```

## Deployment

This project is ready to deploy on Netlify, Firebase Hosting, or Vercel after connecting it to your own account.

For Vercel:

1. Push the project to your GitHub repository.
2. Import the repository into Vercel.
3. Vercel should detect this as a Vite app automatically.
4. Build command: `npm run build`
5. Output directory: `dist`
6. Click deploy.

For Netlify:

1. Push the project to your GitHub repository.
2. Import the repo into Netlify.
3. Use `npm run build` as the build command.
4. Use `dist` as the publish directory.

For Firebase Hosting:

1. Run `firebase init hosting`.
2. Set `dist` as the public directory.
3. Run `npm run build`.
4. Deploy with `firebase deploy`.

## Notes

- I could not push to GitHub or deploy from this environment because that requires your GitHub or hosting account credentials.
