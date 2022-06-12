import React from "react";
import { useLoginState } from "@/contexts/login.context";

const Home = (props) => {
  const { userInfo } = useLoginState();
  return (
    <div className="center">
      <h1 style={{ textAlign: "center" }}>
        Hello There <span style={{ fontSize: "36px" }}>👋</span>
      </h1>
      <pre style={{ fontSize: "16px" }}>
        {JSON.stringify(userInfo, null, 2)}
      </pre>
    </div>
  );
};

export default Home;
