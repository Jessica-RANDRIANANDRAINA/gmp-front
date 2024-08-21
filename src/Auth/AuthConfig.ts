export const msalConfig = {
  auth: {
    clientId: "f0557af9-03b4-43b4-9ec0-b4c8010ecfb7",
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
