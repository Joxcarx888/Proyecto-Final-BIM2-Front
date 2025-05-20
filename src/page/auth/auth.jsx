import { useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Login } from "../../components/Login";
import { Register } from "../../components/Register";
import "./styleAuth.css";

export const Auth =()=> {
  const containerRef = useRef(null);

  const handleSignInClick = () => {
    containerRef.current?.classList.remove("toggle");
  };

  const handleSignUpClick = () => {
    console.log("Registrarse clickeado");
    containerRef.current?.classList.add("toggle");
  };

  return (
    <>
      <Helmet>
        <link
          rel="stylesheet"
          href="https://cdn.lineicons.com/4.0/lineicons.css"
        />
      </Helmet>

      <div className="app">
        <div className="container" ref={containerRef}>
          <div className="container-form sign-in-container">
            <Login switchAuthHandler={handleSignUpClick} />
          </div>

          <div className="container-form sign-up-container">
            <Register switchAuthHandler={handleSignInClick} />
          </div>

          <div className="container-welcome">
            <div className="welcome welcome-sign-up">
              <h3>¡Bienvenido!</h3>
              <p>Ingrese sus datos</p>
              <button className="button" onClick={handleSignUpClick}>
                Registrarse <i className="lni lni-arrow-left login"></i>
              </button>
            </div>
            <div className="welcome welcome-sign-in">
              <h3>¡Hola!</h3>
              <p>Registre sus datos</p>
              <button className="button" onClick={handleSignInClick}>
                Iniciar Sesión <i className="lni lni-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Auth;
