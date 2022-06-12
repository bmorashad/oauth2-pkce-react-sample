import axios from "axios";
import cryptoRandomString from "crypto-random-string";
import { encode as base64encode } from "base64-arraybuffer";
import {
  getItemFromLocalStorage,
  storeItemInLocalStorage,
  removeItemFromLocalStorage,
} from "../utils/local-storage.utils";

export const storeToken = (tokenData) => {
  storeItemInLocalStorage("id_token", tokenData);
};
export const removeToken = () => {
  removeItemFromLocalStorage("id_token");
};

export const getTokenData = () => {
  return getItemFromLocalStorage("id_token");
};

export const generateCodeVerifier = () => {
  return cryptoRandomString({ length: 128, type: "url-safe" });
};

export const storeStateInLocalStorage = (state) => {
  storeItemInLocalStorage("state", state);
};

export const generateState = () => {
  return cryptoRandomString({ length: 10, type: "url-safe" });
};

export const storeNextRouteInLocalStorage = (nextRoute) => {
  storeItemInLocalStorage("nextRoute", nextRoute);
};

export const getNextRouteFromLocalStorage = () => {
  return getItemFromLocalStorage("nextRoute");
};

export const clearNextRouteFromLocalStorage = () => {
  removeItemFromLocalStorage("nextRoute");
};

export const storeCodeVerifierInLocalStorage = (code_verifier) => {
  storeItemInLocalStorage("code_verifier", code_verifier);
};

export const getCodeVerifierFromLocalStorage = () => {
  return getItemFromLocalStorage("code_verifier");
};

export const getStateFromLocalStorage = () => {
  return getItemFromLocalStorage("state");
};

export const generateCodeChallenge = async (codeVerifier) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  const base64Digest = base64encode(digest);
  // you can extract this replacing code to a function
  return base64Digest
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
};

export const verifyStateAndFetchToken = async (
  config,
  code,
  state
) => {
  let storedState = getStateFromLocalStorage();
  if (storedState !== state) {
    throw new Error("State in query param does not match");
  }
  let formData = new URLSearchParams();
  formData.append("client_id", config.CLIENT_ID);
  formData.append("code", code);
  formData.append("grant_type", "authorization_code");
  formData.append("redirect_uri", config.REDIRECT_URI);
  formData.append("code_verifier", getCodeVerifierFromLocalStorage());
  formData.append("state", state);
  try {
    let tokenRes = await axios({
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      url: config.TOKEN_ENDPOINT,
      data: formData,
    });
    return tokenRes.data;
  } catch (err) {
    console.log("ERROR", err);
    throw err;
  }
};

export const retrieveUserInfo = async (config, token) => {
  let authroizationHeader = getBearAuthorizationHeader(token);
  let userInfoRes = await axios.get(config.USER_INFO_ENDPOINT, {
    headers: { ...authroizationHeader },
  });
  return userInfoRes.data;
};

export const getNewTokenFromRefreshToken = async (
  config,
  refreshToken
) => {
  let formData = new URLSearchParams();
  formData.append("client_id", config.CLIENT_ID);
  formData.append("grant_type", "refresh_token");
  formData.append("redirect_uri", config.REDIRECT_URI);
  formData.append("code_verifier", getCodeVerifierFromLocalStorage());
  formData.append("refresh_token", refreshToken);
  let tokenRes = await axios({
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    url: config.TOKEN_ENDPOINT,
    data: formData,
  });
  return tokenRes.data;
};
export const pkceRedirectLogin = async (config = {}) => {
  const code_verifier = generateCodeVerifier();
  const state = generateState();
  generateCodeChallenge(code_verifier).then((challenge) => {
    storeCodeVerifierInLocalStorage(code_verifier);
    storeStateInLocalStorage(state);
    let authorizationUrl = `${config.AUTHORIZE_ENDPOINT}?client_id=${config.CLIENT_ID}&redirect_uri=${config.REDIRECT_URI}&response_type=${config.RESPONSE_TYPE}&state=${state}&scope=${config.SCOPE}&code_challenge=${challenge}&code_challenge_method=S256`;
    window.location.assign(authorizationUrl);
  });
};

export const getBearAuthorizationHeader = (token) => {
  return { Authorization: "Bearer " + token };
};
