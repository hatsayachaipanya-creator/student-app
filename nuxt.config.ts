// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss"],
  devtools: { enabled: true },
  compatibilityDate: "2024-04-03",
  app: {
    head: {
      htmlAttrs: {
        "data-theme": "moneytracker",
      },
      title: "Money Tracker | รายรับ-รายจ่าย",
      meta: [
        {
          name: "description",
          content:
            "ระบบบันทึกรายรับ-รายจ่ายส่วนบุคคล - Personal Expense Tracker",
        },
      ],
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
        },
      ],
    },
  },
});
