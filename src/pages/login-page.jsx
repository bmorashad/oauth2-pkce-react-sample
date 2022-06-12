import React, { useContext, useEffect, useState } from "react";
import {
  verifyStateAndFetchToken,
  pkceRedirectLogin,
  clearNextRouteFromLocalStorage,
  getNextRouteFromLocalStorage,
  storeNextRouteInLocalStorage,
  retrieveUserInfo,
} from "../services/oauth.service";
import { useNavigate } from "react-router-dom";
import { useLoginState } from "../contexts/login.context";
import Spinner from "../components/spinner/spinner.component";

const Login = (props) => {
  const validateMissingConfig = (config) => {
    const validationFeedback = [];
    Object.entries(config).forEach((entry) => {
      if (!entry[1]) {
        validationFeedback.push({
          key: entry[0],
        });
      }
    });
    return validationFeedback;
  };

  const navigate = useNavigate();
  const loginState = useLoginState();
  const { oauthConfig, logIn } = loginState;
  const [error, setError] = useState({
    isError: false,
    isRetry: true,
    description: "",
  });

  useEffect(() => {
    const validationFeedback = validateMissingConfig(oauthConfig);
    if (validationFeedback.length > 0) {
      setError({
        isError: true,
        isRetry: false,
        description:
          "Make sure you have added these oauth configs to .env.local. " +
          JSON.stringify(validationFeedback),
      });
      return;
    }
    const urlQueryParams = new URLSearchParams(
      window.location.search
    );
    if (urlQueryParams.has("error")) {
      setError({
        isError: true,
        isRetry: true,
        description: urlQueryParams.get("error"),
      });
      return;
    }
    if (!urlQueryParams.has("code")) {
      startLoginFlow();
      return;
    }
    verifyStateAndFetchToken(
      oauthConfig,
      urlQueryParams.get("code"),
      urlQueryParams.get("state")
    )
      .then(async (tokenData) => {
        let userInfo;
        try {
          userInfo = await retrieveUserInfo(
            oauthConfig,
            tokenData.access_token
          );
        } catch (e) {
          setError({
            isError: true,
            description:
              "Error occurred while trying to retrieve user information",
          });
          return;
        }
        let next = getNextRouteFromLocalStorage();
        if (!next) {
          next = "/";
        }
        clearNextRouteFromLocalStorage();
        logIn(userInfo, tokenData, () => navigate(next));
      })
      .catch((e) => {
        setError({
          isError: true,
          isRetry: true,
          description: `Error occurred while requesting token using the code in query param. Retry login`,
        });
      });
  }, []);

  const startLoginFlow = () => {
    const { next } = props;
    if (props.next) {
      storeNextRouteInLocalStorage(next);
    }
    pkceRedirectLogin(oauthConfig);
  };
  return error.isError ? (
    <div
      style={{
        height: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h2 style={{ textAlign: "center", maxWidth: "60ch" }}>
        {error.description}
      </h2>
      {error.isRetry && (
        <button style={{ fontSize: "18px" }} onClick={startLoginFlow}>
          Retry
        </button>
      )}
    </div>
  ) : (
    <Spinner />
  );
};

export default Login;
