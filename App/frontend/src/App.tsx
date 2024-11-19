 
import "./App.css";
import LoginForm from "./components/auth/loginForm";

import RegisterForm from "./components/auth/registerForm";
import Header from "./components/Header/header";


function App() {
   

  return (
    <>
      <div>
        <Header/>
        <LoginForm />
      </div>
    </>
  );
}

export default App;
