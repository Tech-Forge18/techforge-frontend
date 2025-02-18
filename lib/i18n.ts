import i18n from "i18next"
import { initReactI18next } from "react-i18next"

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        dashboard: "Dashboard",
        members: "Members",
        projects: "Projects",
        courses: "Courses",
        // Add more translations as needed
      },
    },
    es: {
      translation: {
        dashboard: "Tablero",
        members: "Miembros",
        projects: "Proyectos",
        courses: "Cursos",
        // Add more translations as needed
      },
    },
    fr: {
      translation: {
        dashboard: "Tableau de bord",
        members: "Membres",
        projects: "Projets",
        courses: "Cours",
        // Add more translations as needed
      },
    },
    de: {
      translation: {
        dashboard: "Armaturenbrett",
        members: "Mitglieder",
        projects: "Projekte",
        courses: "Kurse",
        // Add more translations as needed
      },
    },
  },
  lng: "en", // Set default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
})

export default i18n

