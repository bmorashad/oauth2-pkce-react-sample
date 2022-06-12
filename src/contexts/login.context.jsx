import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { getNewTokenFromRefreshToken } from "../services/oauth.service";

const LoginContext = React.createContext();

const LoginProvider = ({ children }) => {
  let oauthConfig = {
    CLIENT_ID: import.meta.env.VITE_GITLAB_CLIENT_ID,
    REDIRECT_URI: import.meta.env.VITE_REDIRECT_URI,
    CLIENT_URL: import.meta.env.VITE_CLIENT_URL,
    TOKEN_ENDPOINT: import.meta.env.VITE_TOKEN_ENDPOINT,
    AUTHORIZE_ENDPOINT: import.meta.env.VITE_AUTHORIZE_ENDPOINT,
    RESPONSE_TYPE: import.meta.env.VITE_RESPONSE_TYPE,
    SCOPE: import.meta.env.VITE_SCOPE,
    GRANT_TYPE: import.meta.env.VITE_GRANT_TYPE,
    USER_INFO_ENDPOINT: import.meta.env.VITE_USER_INFO_ENDPOINT,
  };
  const [onLogin, setOnLogin] = useState(() => () => {});
  const [tokenData, setTokenData] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  let tokenDataRef = useRef(tokenData);
  let isTokenRenewalInProcess = useRef(false);
  let isTokenRenewalFailed = useRef(false);
  let promiseResolvers = useRef([]);

  useEffect(() => {
    onLogin();
  }, [onLogin, setOnLogin, tokenData, setTokenData]);

  const logIn = (userInfo, tokenData, callback = () => null) => {
    tokenDataRef.current = tokenData;
    setTokenData(tokenData);
    setUserInfo(userInfo);
    setOnLogin(() => callback);
  };

  const renewToken = () => {
    if (!tokenDataRef.current) {
      throw new Error("User is not logged in to retrieve new token");
    }
    if (!tokenDataRef.current.refresh_token) {
      throw new Error(
        "Refresh token not found. Refresh token might not be enabled in your oAuth provider"
      );
    }

    return new Promise((resolve, reject) => {
      promiseResolvers.current.push({ resolve, reject });
      if (!isTokenRenewalInProcess.current) {
        isTokenRenewalInProcess.current = true;
        getNewTokenFromRefreshToken(
          oauthConfig,
          tokenDataRef.current.refresh_token
        )
          .then((newTokenData) => {
            tokenDataRef.current = newTokenData;
            isTokenRenewalInProcess.current = false;
            isTokenRenewalFailed.current = false;
            setTokenData(newTokenData);
            promiseResolvers.current.forEach((p) => {
              p.resolve(newTokenData.access_token);
            });
          })
          .catch((err) => {
            isTokenRenewalInProcess.current = false;
            isTokenRenewalFailed.current = true;
            promiseResolvers.current.forEach((p) => {
              p.reject(
                new Error(
                  "Error occurred while refreshing the token",
                  err
                )
              );
            });
          });
      }
    });
  };

  return (
    <LoginContext.Provider
      value={{ tokenData, logIn, renewToken, userInfo, oauthConfig }}
    >
      {children}
    </LoginContext.Provider>
  );
};

const useLoginState = () => {
  const loginState = useContext(LoginContext);
  if (loginState === undefined) {
    throw new Error(
      "useLoginState must be used within LoginProvider"
    );
  }
  return loginState;
};

export { LoginProvider, useLoginState };
