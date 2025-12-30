Act as a Senior Frontend Developer expert in Vue.js and Nuxt 3.

I want you to build a **"Personal Expense Tracker"** application.
The goal is to have a minimal, mobile-first web app to track income and expenses without a backend.

### Tech Stack:

- **Framework:** Nuxt 3 (latest version).
- **Styling:** Tailwind CSS v4 (use the new CSS-first configuration approach).
- **UI Library:** DaisyUI (compatible with Tailwind 4).
- **State Management:** Nuxt `useState` or standard Ref, synchronized with Browser `localStorage`.
- **Icons:** Lucide-vue-next or Heroicons.

### Core Features & Requirements:

1. **Data Structure:**
   - Define a TypeScript interface `Transaction` containing: `id` (string/uuid), `title` (string), `amount` (number), `type` ('income' | 'expense'), and `date` (string/ISO).

2. **State Management (Crucial):**
   - Create a Composable named `useTransactions`.
   - It must save/load data from `localStorage`.
   - **Important:** Handle "Hydration Mismatch" correctly. Since `localStorage` is client-side only, ensure the data is only loaded on `onMounted` or use a pattern that prevents server-client DOM mismatch.

3. **UI Components (Single Page View):**
   - **Dashboard Section:** - Show 3 Summary Cards: Total Balance, Total Income, Total Expense.
     - Use distinct colors for Income (Green-ish) and Expense (Red-ish).
   - **Add Transaction Form:**
     - A simple form (or Modal) to add new items.
     - Fields: Title, Amount, Type (Radio/Select), Date.
   - **Transaction List:**
     - Display a list of recent transactions.
     - Each item should show the title, date, and amount (colored by type).
     - Include a "Delete" button for each item.

4. **Design System:**
   - Use DaisyUI components (Cards, Stats, Table/List, Inputs, Buttons).
   - Theme: Use a clean theme like "lofi" or "cupcake" but support Dark mode if possible.
   - Layout: specific for Mobile view but responsive for Desktop.

### Deliverables:

- Please provide the project structure.
- Provide the code for `nuxt.config.ts` (setup for Tailwind 4 & DaisyUI).
- Provide the code for `composables/useTransactions.ts`.
- Provide the code for `app.vue` or `pages/index.vue` assembling everything.

Start by explaining the setup for Tailwind CSS v4 with Nuxt as it differs from v3.
