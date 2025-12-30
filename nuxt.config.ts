// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate",
  ],
  devtools: { enabled: true },
  compatibilityDate: "2024-04-03",
  app: {
    head: {
      htmlAttrs: {
        "data-theme": "studentreg",
      },
      title: "Student Registration System | ระบบลงทะเบียนเรียน",
      meta: [
        {
          name: "description",
          content:
            "ระบบลงทะเบียนเรียนสำหรับนักศึกษา - Student Course Registration System",
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
