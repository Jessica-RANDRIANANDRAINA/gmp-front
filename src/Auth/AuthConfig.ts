export const msalConfig = {
  auth: {
    clientId: "3e8ca2e1-32e3-4d21-84f9-6e893e8246ea",
    authority: "https://login.microsoftonline.com/manojbedreoutlook.onmicrosoft.com",
    redirectUri: "http://localhost:5100",
    postLogoutRedirectUri: "http://localhost:5100"
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ["User.Read"],
};
