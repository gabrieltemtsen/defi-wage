import Link from "next/link";
import React from "react";

 const PleaseLogin = () => {
  return (
    <div>
      <h2>Please Login</h2>
      <p>You need to be logged in to access this page.</p>
      <Link href="/" style={{ color: "blue", textDecoration: "none" }}>
        Go back to the homePage
      </Link>
    </div>
  );
};
export default PleaseLogin;