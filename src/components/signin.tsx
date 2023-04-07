import React, { useState } from "react";

interface SignProps {
  onSignin: (password: string) => void;
}
const Signin = ({ onSignin }: SignProps): JSX.Element => {
  const [password, setPassowrd] = useState<string>("");

  const handleChanage = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target;
    setPassowrd(value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    onSignin(password);
  };
  return (
    <div>
      <h1>Sign In</h1>
      <form onSubmit={onSubmit}>
        <label>
          Password:
          <input
            onChange={handleChanage}
            name="password"
            type="password"
            required
          />
        </label>
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default Signin;
