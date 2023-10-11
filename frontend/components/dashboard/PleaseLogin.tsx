import React from "react";

 const PleaseLogin = () => {
  return (
    <div>
      <h2>Please Login</h2>
      <p>You need to be logged in to access this page.</p>
      <a href="/" style={{ color: "blue", textDecoration: "none" }}>
        Go back to the homePage
      </a>
    </div>
  );
};
export default PleaseLogin;