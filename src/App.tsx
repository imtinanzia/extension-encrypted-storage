import React, { useState, useEffect } from "react";
import { initializeApp, signIn, resetApp } from "./utils";
import { Signin, Home } from "./components";

const App = (): JSX.Element => {
  const [signedIn, setSignedIn] = useState<boolean>(false);
  const [secret, setSecret] = useState<string>("");

  const onSignin = (password: string): void => {
    signIn(password, setSignedIn, setSecret);
  };
  const signOut = (): void => {
    setSignedIn(false);
    setSecret("");
  };

  useEffect(() => {
    initializeApp(setSecret);
  }, [setSecret]);

  if (!signedIn) return <Signin onSignin={onSignin} />;

  return (
    <Home
      resetApp={resetApp}
      signOut={signOut}
      secret={secret}
      setSecret={setSecret}
    />
  );
};

export default App;
