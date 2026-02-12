// utils/auth.js
export const isAuthenticated = (): boolean => {
  // Exemple : token stocké dans localStorage
  return localStorage.getItem("token") !== null;
};
