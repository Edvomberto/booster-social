// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "settings": "Settings",
      "account_settings": "Account Settings",
      "email_address": "Email address",
      "timezone": "Timezone",
      "dark_mode": "Dark Mode",
      "rtl_text": "Right to left text direction",
      "connected_as": "Connected as",
      "disconnect": "Disconnect",
      "add_authorized_person": "Add authorized person",
      "authorized_people": "Authorized people",
      "remove": "Remove",
      "delete_account": "Delete Account",
      "preferred_language": "Preferred language",
      "search_keywords": "Search keywords",
      "personal_description": "Personal description",
      "main_topics": "Main topics",
      "freedom_level": "Freedom level",
      "ai_model": "Preferred AI model"
    }
  },
  pt: {
    translation: {
      "settings": "Configurações",
      "account_settings": "Configurações da Conta",
      "email_address": "Endereço de email",
      "timezone": "Fuso horário",
      "dark_mode": "Modo Escuro",
      "rtl_text": "Texto da direita para a esquerda",
      "connected_as": "Conectado como",
      "disconnect": "Desconectar",
      "add_authorized_person": "Adicionar pessoa autorizada",
      "authorized_people": "Pessoas autorizadas",
      "remove": "Remover",
      "delete_account": "Excluir Conta",
      "preferred_language": "Idioma preferido",
      "search_keywords": "Palavras-chave de busca",
      "personal_description": "Descrição pessoal",
      "main_topics": "Principais tópicos",
      "freedom_level": "Nível de liberdade",
      "ai_model": "Modelo de IA preferido"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // Idioma padrão
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
