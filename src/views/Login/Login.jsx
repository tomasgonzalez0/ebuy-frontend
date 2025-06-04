import Styles from './Login.module.css';
import { NavLink, resolvePath, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { ReactComponent as BackButton } from '../../images/goback.svg'
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const body = {
      Email: email,
      Password: password,
      Page: ""
    };

    try {
      const response = await fetch("http://ebuy.runasp.net/api/Login/SignIn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      console.log(data);

    if (data.Auth && data.Status) {
        localStorage.setItem("Id", data.Id);
        localStorage.setItem("auth", data.Auth);
        localStorage.setItem("token", data.Token);
        localStorage.setItem("role", data.Role);
        localStorage.setItem("userId", data.Id); 
        localStorage.setItem("startPage", data.StartPage);
        localStorage.setItem("userEmail", data.Email);

        if (data.Role === "Supplier") {
            navigate("/supplier/home");
        } else if (data.Role === "Employee") {
            navigate("/employee/home");
        } else {
            navigate("/");
        }
    }else{
        alert("Email or Password incorrect");
        setEmail("");
        setPassword("");
    }


    } catch (err) {
      console.error("Error en login:", err);
      alert("Ocurrió un error al intentar iniciar sesión.");
    }
  };

  return (
    <section className={Styles["register"]}>
      <Form onSubmit={handleLogin} className={Styles["register-form"]}>
        <NavLink to={resolvePath(-1).pathname} className={Styles["back-link"]}>
          <BackButton className={Styles["back-button"]} />
        </NavLink>

        <h2 className={Styles["register-h2"]}>Login</h2>

        <Form.Group className={`${Styles["input-container"]} mb-3`} controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className={`${Styles["input-container"]} mb-3`} controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit" id={Styles["submit-button"]}>
          Login
        </Button>

        <Form.Text className={`${Styles["login-text"]} text-muted`} id={Styles["login-text"]}>
          ¿Don’t have an account?{" "}
          <NavLink to="/register">
            Register
          </NavLink>
        </Form.Text>
      </Form>
    </section>
  );
}
