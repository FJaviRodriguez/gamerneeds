const API_BASE_URL = import.meta.env.VITE_API_URL;

export const config = {
  api: {
    base: import.meta.env.VITE_API_URL,
    juegos: `${import.meta.env.VITE_API_URL}/juegos`
  }
};