import { useState } from "react";
import {
  createUserWithEmailAndPassword
} from "firebase/auth";

import { auth } from "./firebase";
import { useNavigate, Link } from "react-router-dom";

function Register() {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const navigate =
    useNavigate();

  const register = async () => {

    try {

      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      navigate("/");

    } catch (error) {

      alert(error.message);

    }
  };

  return (

    <div style={{ padding: "40px" }}>

      <h1>Register</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) =>
          setEmail(
            e.target.value
          )
        }
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setPassword(
            e.target.value
          )
        }
      />

      <br /><br />

      <button
        onClick={register}
      >
        Register
      </button>

      <p>

        Already have account?

        <Link to="/login">
          Login
        </Link>

      </p>

    </div>
  );
}

export default Register;