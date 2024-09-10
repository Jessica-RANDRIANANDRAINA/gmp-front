import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  sub: string;
  name: string;
  jti: string;
  exp: number;
}


export const decodeToken = (source: string) => {
  var token;
  if (source === "pr") {
    token = localStorage.getItem("_au_pr");
  } else if (source === "ad") {
    token = token = localStorage.getItem("_au_ad");
  }
  if (token) {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded;
    } catch (error) {
      console.error(`Invalid token ${error}`);
    }
  }
};
