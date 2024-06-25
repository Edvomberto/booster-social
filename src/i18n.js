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
      "ai_model": "Preferred AI model",
      "Conservative": "Conservative",
      "Save_Settings": "Save Settings",
      "ideas": "Ideas",
      "Sketch": "Sketch",
      "Scheduling": "Scheduling",
      "Posted": "Posted",
      "Add_Post": "Add Post",
      "credits": "Credits",
      "renew_in": "Renew In",
      "Username": "Username",
      "password": "Password",
      "Dont_have_account": "Don't have an account? Register",
      "login": "Login",
      "add_post": "Add Post",
      "edit_post": "Edit Post",
      "delete_post": "Delete Post",
      "duplicate_post": "Duplicate Post",
      "notification": "Notification",
      "post_published": "Post published!",
      "error_publishing_post": "Error publishing post.",
      "post_duplicated": "Post duplicated!",
      "error_duplicating_post": "Error duplicating post.",
      "error_deleting_post": "Error deleting post.",
      "ideas_column": "Ideas",
      "sketch_column": "Sketch",
      "scheduling_column": "Scheduling",
      "posted_column": "Posted",
      "login": "Login",
      "username": "Username",
      "password": "Password",
      "login_button": "Login",
      "register_link": "Don't have an account? Register",
      "invalid_credentials": "Invalid username or password!",
      "login_title": "Login",
      "login_header": "Login to your account",
      "login_footer": "All rights reserved.",
      "dashboard": "Dashboard",
      "schedules": "Schedules",
      "alerts": "Alerts",
      "settings": "Settings",
      "credits": "Credits",
      "renew_in": "Renew in",
      "no_subscription_date": "N/A",
      "logout": "Logout",
      "edit_post": "Edit Post",
      "add_post": "Add Post",
      "subject": "Subject",
      "post_ideas": "Post Ideas",
      "post_content_placeholder": "Post content will appear here",
      "prev": "Prev",
      "next": "Next",
      "generate_post": "Generate Post",
      "generate_title": "Generate Title",
      "title":"Title",
      "post": "Post",
      "add": "Add",
      "save": "Save",
      "cancel": "Cancel",
      "image_upload_success": "Image uploaded successfully!",
      "image_upload_error": "Error uploading image!",
      "title_generated_success": "Title generated successfully!",
      "title_generated_error": "Error generating title!",
      "post_generated_success": "Post generated successfully!",
      "post_generated_error": "Error generating post!",
      "linkedin_post_success": "Post published on LinkedIn successfully!",
      "linkedin_post_error": "Error posting on LinkedIn.",
      "login_linkedin_warning": "Please log in to LinkedIn first.",
      "carousel" : "Carousel"
               
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
      "ai_model": "Modelo de IA preferido",
      "Conservative": "Conservador",
      "Save_Settings": "Salvar Configurações",
      "ideas": "Ideias",
      "Sketch": "Rascunho",
      "Scheduling": "Agendado",
      "Posted": "Postado",
      "Add_Post": "Adicionar Post",
      "credits": "Créditos",
      "renew_in": "Renova em",
      "Username": "Usuário",
      "password": "Senha",
      "Dont_have_account": "Não tem uma conta? Registre-se",
      "login": "Entrar",
      "add_post": "Adicionar Post",
      "edit_post": "Editar Post",
      "delete_post": "Excluir Post",
      "duplicate_post": "Duplicar Post",
      "notification": "Notificação",
      "post_published": "Post publicado!",
      "error_publishing_post": "Erro ao publicar post.",
      "post_duplicated": "Post duplicado!",
      "error_duplicating_post": "Erro ao duplicar post.",
      "error_deleting_post": "Erro ao excluir post.",
      "ideas_column": "Ideias",
      "sketch_column": "Rascunho",
      "scheduling_column": "Agendado",
      "posted_column": "Postado",
      "edit_post": "Edit Post",
      "add_post": "Add Post",
      "subject": "Subject",
      "post_ideas": "Post Ideas",
      "post_content_placeholder": "Post content will appear here",
      "prev": "Prev",
      "next": "Next",
      "generate_post": "Generate Post",
      "generate_title": "Generate Title",
      "title":"Título",
      "post": "Post",
      "add": "Add",
      "save": "Save",
      "cancel": "Cancel",
      "image_upload_success": "Image uploaded successfully!",
      "image_upload_error": "Error uploading image!",
      "title_generated_success": "Title generated successfully!",
      "title_generated_error": "Error generating title!",
      "post_generated_success": "Post generated successfully!",
      "post_generated_error": "Error generating post!",
      "linkedin_post_success": "Post published on LinkedIn successfully!",
      "linkedin_post_error": "Error posting on LinkedIn.",
      "login_linkedin_warning": "Please log in to LinkedIn first.",
      "login": "Entrar",
      "username": "Usuário",
      "password": "Senha",
      "login_button": "Entrar",
      "register_link": "Não tem uma conta? Registre-se",
      "invalid_credentials": "Usuário ou senha inválido!",
      "login_title": "Login",
      "login_header": "Faça login na sua conta",
      "login_footer": "Todos os direitos reservados.",
      "dashboard": "Painel de Controle",
      "schedules": "Agendamentos",
      "alerts": "Alertas",
      "settings": "Configurações",
      "credits": "Créditos",
      "renew_in": "Renova em",
      "no_subscription_date": "N/A",
      "logout": "Sair",
      "edit_post": "Editar Post",
      "add_post": "Adicionar Post",
      "subject": "Assunto",
      "post_ideas": "Ideias de Post",
      "post_content_placeholder": "O conteúdo do post aparecerá aqui",
      "prev": "Anterior",
      "next": "Próximo",
      "generate_post": "Gerar Post",
      "generate_title": "Gerar Título",
      "post": "Postar",
      "add": "Adicionar",
      "save": "Salvar",
      "cancel": "Cancelar",
      "image_upload_success": "Imagem carregada com sucesso!",
      "image_upload_error": "Erro ao fazer upload da imagem!",
      "title_generated_success": "Título gerado com sucesso!",
      "title_generated_error": "Erro ao gerar o título!",
      "post_generated_success": "Post gerado com sucesso!",
      "post_generated_error": "Erro ao gerar o post!",
      "linkedin_post_success": "Post publicado no LinkedIn com sucesso!",
      "linkedin_post_error": "Erro ao postar no LinkedIn.",
      "login_linkedin_warning": "Faça login no LinkedIn primeiro.",
      "carousel" : "Carrossel"
               
    }
  },
  es: {
    translation: {
      "settings": "Configuraciones",
      "account_settings": "Configuraciones de la Cuenta",
      "email_address": "Dirección de correo electrónico",
      "timezone": "Zona horaria",
      "dark_mode": "Modo Oscuro",
      "rtl_text": "Texto de derecha a izquierda",
      "connected_as": "Conectado como",
      "disconnect": "Desconectar",
      "add_authorized_person": "Agregar persona autorizada",
      "authorized_people": "Personas autorizadas",
      "remove": "Eliminar",
      "delete_account": "Eliminar Cuenta",
      "preferred_language": "Idioma preferido",
      "search_keywords": "Buscar palabras clave",
      "personal_description": "Descripción personal",
      "main_topics": "Temas principales",
      "freedom_level": "Nivel de libertad",
      "ai_model": "Modelo de IA preferido",
      "Conservative": "Conservador",
      "Save_Settings": "Guardar Configuraciones",
      "ideas": "Ideas",
      "Sketch": "Borrador",
      "Scheduling": "Programando",
      "Posted": "Publicado",
      "Add_Post": "Agregar Publicación",
      "credits": "Créditos",
      "renew_in": "Renovar en",
      "Username": "Usuario",
      "password": "Contraseña",
      "Dont_have_account": "¿No tienes una cuenta? Regístrate",
      "login": "Iniciar sesión",
      "add_post": "Agregar Publicación",
      "edit_post": "Editar Publicación",
      "delete_post": "Eliminar Publicación",
      "duplicate_post": "Duplicar Publicación",
      "notification": "Notificación",
      "post_published": "¡Publicación publicada!",
      "error_publishing_post": "Error al publicar la publicación.",
      "post_duplicated": "¡Publicación duplicada!",
      "error_duplicating_post": "Error al duplicar la publicación.",
      "error_deleting_post": "Error al eliminar la publicación.",
      "ideas_column": "Ideas",
      "sketch_column": "Borrador",
      "scheduling_column": "Programando",
      "posted_column": "Publicado",
      "edit_post": "Editar Post",
      "add_post": "Adicionar Post",
      "subject": "Assunto",
      "post_ideas": "Ideias de Post",
      "post_content_placeholder": "O conteúdo do post aparecerá aqui",
      "prev": "Anterior",
      "next": "Próximo",
      "generate_post": "Gerar Post",
      "generate_title": "Gerar Título",
      "title":"Título",
      "post": "Postar",
      "add": "Adicionar",
      "save": "Salvar",
      "cancel": "Cancelar",
      "image_upload_success": "Imagem carregada com sucesso!",
      "image_upload_error": "Erro ao fazer upload da imagem!",
      "title_generated_success": "Título gerado com sucesso!",
      "title_generated_error": "Erro ao gerar o título!",
      "post_generated_success": "Post gerado com sucesso!",
      "post_generated_error": "Erro ao gerar o post!",
      "linkedin_post_success": "Post publicado no LinkedIn com sucesso!",
      "linkedin_post_error": "Erro ao postar no LinkedIn.",
      "login_linkedin_warning": "Faça login no LinkedIn primeiro.",
      "login": "Iniciar sesión",
      "username": "Usuario",
      "password": "Contraseña",
      "login_button": "Iniciar sesión",
      "register_link": "¿No tienes una cuenta? Regístrate",
      "invalid_credentials": "¡Usuario o contraseña inválidos!",
      "login_title": "Iniciar sesión",
      "login_header": "Inicia sesión en tu cuenta",
      "login_footer": "Todos los derechos reservados.",
      "dashboard": "Tablero",
      "schedules": "Horarios",
      "alerts": "Alertas",
      "settings": "Configuraciones",
      "credits": "Créditos",
      "renew_in": "Renueva en",
      "no_subscription_date": "N/A",
      "logout": "Cerrar sesión",
      "edit_post": "Editar Publicación",
      "add_post": "Agregar Publicación",
      "subject": "Asunto",
      "post_ideas": "Ideas de Publicación",
      "post_content_placeholder": "El contenido de la publicación aparecerá aquí",
      "prev": "Anterior",
      "next": "Siguiente",
      "generate_post": "Generar Publicación",
      "generate_title": "Generar Título",
      "post": "Publicar",
      "add": "Agregar",
      "save": "Guardar",
      "cancel": "Cancelar",
      "image_upload_success": "Imagen subida con éxito!",
      "image_upload_error": "Error al subir la imagen!",
      "title_generated_success": "Título generado con éxito!",
      "title_generated_error": "Error al generar el título!",
      "post_generated_success": "Publicación generada con éxito!",
      "post_generated_error": "Error al generar la publicación!",
      "linkedin_post_success": "Publicación publicada en LinkedIn con éxito!",
      "linkedin_post_error": "Error al publicar en LinkedIn.",
      "login_linkedin_warning": "Por favor, inicia sesión en LinkedIn primero.",
      "carousel" : "Carrusel"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "es", // Idioma padrão
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;