 
import "./App.css";
import LoginForm from "./components/auth/loginForm";
import UserRegistrationForm from "./components/UserRegistrationForm";

function App() {
   

  return (
    <>
      <div>
        <h1>Welcome to Better Me</h1>
        <LoginForm onLogin={function (email: string, password: string): void {
          throw new Error("Function not implemented.");
        } } />
      </div>
    </>
  );
}

export default App;
