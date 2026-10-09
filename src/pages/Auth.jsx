import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ButtonGradient from "../assets/svg/ButtonGradient";
import Header from "../component/Header";
import Section from "../component/Section";
import Footer from "../component/Footer";
import Button from "../component/Button";
import { useAuth } from "../context/AuthContext";
import { errorMessage } from "../services/api";

const inputClass =
  "w-full h-12 px-4 bg-n-7 border border-n-6 rounded-xl text-n-1 placeholder-n-4 focus:outline-none focus:border-color-1";

const Auth = ({ mode }) => {
  const isRegister = mode === "register";
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isRegister) await register(form);
      else await login({ email: form.email, password: form.password });
      navigate(location.state?.from || "/prediction", { replace: true });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <ButtonGradient />
      <Section id="auth" className="pt-[8rem]">
        <div className="container flex justify-center min-h-[70vh]">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md h-fit p-8 bg-n-8/80 border border-n-6 rounded-3xl space-y-4"
          >
            <h2 className="h4 text-center">{isRegister ? "Create account" : "Welcome back"}</h2>
            <p className="text-center text-sm text-n-3 mb-2">
              {isRegister
                ? "Register to analyze scans and keep your results."
                : "Login to analyze scans and view previous results."}
            </p>

            {isRegister && (
              <input
                className={inputClass}
                placeholder="Full name"
                value={form.fullName}
                onChange={update("fullName")}
                required
              />
            )}
            <input
              className={inputClass}
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={update("email")}
              required
            />
            <input
              className={inputClass}
              type="password"
              placeholder="Password"
              minLength={6}
              value={form.password}
              onChange={update("password")}
              required
            />

            {error && (
              <p className="p-3 rounded-xl bg-red-900/40 border border-red-700 text-sm text-red-200">{error}</p>
            )}

            <Button type="submit" disabled={loading} className="w-full disabled:opacity-60">
              {loading ? "PLEASE WAIT..." : isRegister ? "REGISTER" : "LOGIN"}
            </Button>

            <p className="text-center text-sm text-n-3">
              {isRegister ? "Already have an account? " : "New here? "}
              <Link to={isRegister ? "/login" : "/register"} className="text-color-1 hover:underline">
                {isRegister ? "Login" : "Create an account"}
              </Link>
            </p>
          </form>
        </div>
      </Section>
      <Footer />
    </>
  );
};

export default Auth;
