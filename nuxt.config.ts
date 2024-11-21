export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    '@vee-validate/nuxt',
    '@nuxt/ui',
    '@pinia/colada-nuxt',
    '@nuxt/eslint',
    '@nuxthub/core',
    '@formkit/auto-animate/nuxt',
    '@vueuse/nuxt',
  ],

  eslint: {
    config: {
      standalone: false,
    },
  },

  devtools: { enabled: true },
  compatibilityDate: '2024-11-20',

  veeValidate: {
    // disable or enable auto imports
    autoImports: true,
    // Use different names for components
    componentNames: {
      Form: 'VeeForm',
      Field: 'VeeField',
      FieldArray: 'VeeFieldArray',
      ErrorMessage: 'VeeErrorMessage',
    },
  },

  hub: {
    database: true,
  },
})
