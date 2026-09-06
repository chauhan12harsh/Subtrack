import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {authService} from "../Services/authService";

const Login = () => {
  const navigate = useNavigate();

  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {

        setIsLoading(true);
        setError("");

        const response = await authService.login({email,password});
        
        localStorage.setItem("accessToken", response.token);

        setemail("");
        setPassword("");
        
        navigate("/dashboard");

    } catch (error) {

      console.error(error);
      setError("Invalid email or password");

    } finally {

      setIsLoading(false);

    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Login</h1>

        <div className="space-y-4">
          <div>
            <label className="block mb-1">Email</label>

            <input
              type="text"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              placeholder="Enter email"
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block mb-1">Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full border rounded-lg p-3"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
          <div className="text-center">
            <p>Don't have an account? <Link to="/register">register</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
