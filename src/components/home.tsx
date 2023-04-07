import React from "react";
import { regenerateSecret } from "../utils";

interface HomeProps {
  secret: string;
  setSecret: React.Dispatch<React.SetStateAction<string>>;
  signOut: () => void;
  resetApp: () => void;
}
const Home = ({
  secret,
  setSecret,
  signOut,
  resetApp,
}: HomeProps): JSX.Element => {
  return (
    <div className="popup">
      <h1>My Extension</h1>
      <p>Secret: {!secret ? localStorage.getItem("secrect") : secret}</p>
      <button onClick={() => regenerateSecret(setSecret)}>
        Regenerate Secret
      </button>
      <button onClick={signOut}>Sign Out</button>
      <button onClick={resetApp}>Reset App</button>
    </div>
  );
};

export default Home;
