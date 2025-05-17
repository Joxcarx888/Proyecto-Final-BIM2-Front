import { useRef } from "react";
import { Helmet } from "react-helmet";
import "./styleAuth.css";

function App() {
  const containerRef = useRef(null);

  const handleSignInClick = () => {
    containerRef.current?.classList.remove("toggle");
  };

  const handleSignUpClick = () => {
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
            <form>
              <h2>Iniciar Sesión</h2>
              <div className="container-input">
                <i className="lni lni-envelope"></i>
                <input type="text" placeholder="Email" />
              </div>
              <div className="container-input">
                <i className="lni lni-lock-alt"></i>
                <input type="password" placeholder="Password" />
              </div>
              <a href="#">¿Olvidaste tu contraseña?</a>
              <button type="button" className="button">
                INICIAR SESIÓN
              </button>
            </form>
          </div>

          <div className="container-form sign-up-container">
            <form>
              <h2>Registrarse</h2>
              <div className="container-input">
                <i className="lni lni-user"></i>
                <input type="text" placeholder="Nombre" />
              </div>
              <div className="container-input">
                <i className="lni lni-envelope"></i>
                <input type="text" placeholder="Email" />
              </div>
              <div className="container-input">
                <i className="lni lni-lock-alt"></i>
                <input type="password" placeholder="Password" />
              </div>
              <button type="button" className="button">
                REGISTRARSE
              </button>
            </form>
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

export default App;
