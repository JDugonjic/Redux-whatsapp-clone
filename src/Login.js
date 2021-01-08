import { Button } from "@material-ui/core";
import React from "react";
import { auth, provider } from "./firebase";
import "./Login.css";
import { useDispatch } from "react-redux";
import { login } from "./features/userSlice";

function Login() {
  const dispatch = useDispatch();

  const signIn = () => {
    auth
      .signInWithPopup(provider)
      .then((userAuth) => {
        dispatch(
          login({
            uid: userAuth.user.uid,
            displayName: userAuth.user.displayName,
            photoUrl: userAuth.user.photoURL,
          })
        );
      })
      .catch((error) => alert(error));
  };

  return (
    <div className="login">
      <div className="login__container">
        <img
          src="https://logos-world.net/wp-content/uploads/2020/05/WhatsApp-Logo.png"
          alt=""
        />
        <div className="login__text">
          <h1>Sign in to Chat WhatsApp Clone</h1>
        </div>
        <Button onClick={signIn}>Sign in with Google</Button>
      </div>
    </div>
  );
}

export default Login;
