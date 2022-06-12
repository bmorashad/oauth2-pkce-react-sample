import React, { useContext, useEffect, useState } from "react";
// import { withRouter } from "react-router-dom";
import {
  verifyStateAndFetchToken,
  pkceRedirectLogin,
  clearNextRouteFromLocalStorage,
  getNextRouteFromLocalStorage,
  storeNextRouteInLocalStorage,
  retrieveUserInfo,
} from "../services/oauth.service";
import { useNavigate } from "react-router-dom";
import LoginContext from "../contexts/login.context";
import Spinner from "../components/spinner/spinner.component";

const Login = (props) => {
  const navigate = useNavigate();
  const loginContext = useContext(LoginContext);
  const { oauthConfig, logIn } = loginContext;
  const [error, setError] = useState({
    isError: false,
    isRetry: true,
    description: "",
  });

  useEffect(() => {
    const urlQueryParams = new URLSearchParams(
      window.location.search
    );
    if (!oauthConfig.CLIENT_ID) {
      setError({
        isError: true,
        isRetry: false,
        description:
          "Make sure you have added Gitlab OAuth CLIENT_ID to .env file",
      });
      return;
    }
    if (!oauthConfig.REDIRECT_URI) {
      setError({
        isError: true,
        isRetry: false,
        description:
          "Make sure you have added REDIRECT_URI to .env file",
      });
      return;
    }
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
        console.log(tokenData);
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
