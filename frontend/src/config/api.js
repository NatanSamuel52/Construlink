const apiUrlConfigurada = import.meta.env.VITE_API_URL;

if (!apiUrlConfigurada) {
  throw new Error('A variável VITE_API_URL não foi configurada.');
}

export const API_URL = apiUrlConfigurada.replace(/\/+$/, '');
