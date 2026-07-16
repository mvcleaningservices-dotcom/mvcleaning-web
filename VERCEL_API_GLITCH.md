# Frontend Vercel Deployment Glitch - Workaround Document

## The Glitch
When deploying the frontend to Vercel without a live backend server, the homepage fails to load and displays a "Couldn't load services" error message. 

Because the homepage relies on fetching the services catalog from `/api/services/catalog`, the missing backend causes a `fetch` failure. This failure stops the rest of the homepage (the "How it Works", "Testimonials", and "FAQ" sections) from rendering, leaving the user with a mostly blank page.

## The Temporary Workaround (Mock Data)
To ensure Razorpay reviewers see a fully populated and beautifully designed website, we implemented a temporary workaround in the API layer.

We modified `src/api.ts` to intercept the `listServices` function. Instead of making a real HTTP request to the backend, it instantly returns a hardcoded list of "Mock" services (Deep Cleaning, Sofa Cleaning, Bathroom Cleaning, Kitchen Cleaning).

This tricks the frontend into thinking the backend responded perfectly, allowing the full UI to render on Vercel without throwing an error.

## Action Required Before Live Launch
**CRITICAL:** Before launching this website for real customers, you MUST revert this mock data so the website can fetch live prices and services from your actual database.

**How to revert:**
1. Open `src/api.ts`
2. Find the `listServices` function around Line 130.
3. Replace the entire function with the original real API call:
   ```typescript
   listServices: () => request<PublicService[]>('/services/catalog'),
   ```
4. Update the `VITE_API_URL` in Vercel environment variables to point to your new live backend server (e.g. `https://api.mvcleaning.com`).
