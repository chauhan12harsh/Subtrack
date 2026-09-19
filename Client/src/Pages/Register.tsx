import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../Services/authService";

const Register = () => {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {

    try {

      setError("");
      setSuccessMessage("");
      setIsLoading(true);

      await authService.register({ username, email, password });

      setSuccessMessage("Registration successful!");

      setTimeout(() => {
        navigate("/");
      }, 1500);
      
    } catch (error) {

      console.error(error);
      setError("Registration failed");

    } finally {
      
      setIsLoading(false);

    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">

      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-6">Register</h1>

        <div className="space-y-4">

          <div>
            <label className="block mb-1">Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block mb-1">Username</label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
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

          {successMessage && (
            <p className="text-green-600 text-sm">{successMessage}</p>
          )}

          <button
            onClick={handleRegister}
            disabled={isLoading}
            className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
            <div className="text-center">
            <p>Already have an account? <Link to="/">login</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
