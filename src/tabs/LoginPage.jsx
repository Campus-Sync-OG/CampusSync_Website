// src/pages/LoginPage.jsx
import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import bg from "../assets/images/bg1.png";
import { loginUser } from "../api/ClientApi"; // <-- import the helper function (adjust path if needed)

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Arial', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: #05103a; /* keep page backdrop similar to your earlier overlay */
  }
`;

/* Layout */
const Container = styled.div`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 2rem;
`;

/* Logo position preserved */
const LogoSection = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;

  img { width: 100px; height: auto; }
`;

/* Background image + original overlay/color preserved */
const BackgroundImage = styled.div`
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%; z-index: -4;
  img { width: 100%; height: 100%; object-fit: cover; }
`;

const BackgroundOverlay = styled.div`
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(0, 32, 135, 0.9);
  z-index: -2;
`;

const BackgroundCurve = styled.div`
  position: absolute; top: 0; left: 0; width: 100%; height: 200%; z-index: -1;
  svg { width: 100%; height: 100%; }
`;

/* Slightly polished LoginBox (visual improvements only; colors unchanged) */
const LoginBox = styled.div`
  background: #fff;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 10px 35px rgba(0,0,0,0.16);
  width: 420px;
  padding: 2.25rem 2.25rem;
  max-width: 96%;
  box-sizing: border-box;
  transform: translateY(-6px);
  transition: transform 160ms ease, box-shadow 160ms ease;
  &:hover { transform: translateY(-10px); box-shadow: 0 18px 48px rgba(0,0,0,0.18); }

  @media (max-width: 460px) {
    padding: 1.25rem 1rem;
  }
`;

const Title = styled.h2`
  font-size: 1.8rem; color: #df0043; margin: 0 0 0.6rem 0;
`;

const Sub = styled.p`
  margin: 0 0 1rem 0; color: #333; font-size: 0.95rem;
`;

/* Form */
const Form = styled.form`
  display: flex; flex-direction: column; gap: 0.8rem; align-items: stretch;
`;

/* Input wrapper to allow eye icon and micro-styling */
const FieldWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  padding: 0.95rem 3.25rem 0.95rem 0.95rem; /* reserve space on right for eye icon */
  border-radius: 6px;
  border: 1px solid #dcdcdc;
  font-size: 1rem;
  outline: none;
  transition: box-shadow 0.15s, border-color 0.15s, transform 0.08s;
  background: #fff;
  color: #222;

  &:focus {
    box-shadow: 0 0 0 6px rgba(223,0,67,0.06);
    border-color: #df0043;
  }
`;

/* Eye toggle button placed on right inside the input area */
const EyeToggle = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  height: 30px;
  width: 34px;
  display: inline-grid;
  place-items: center;
  border-radius: 6px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #6b6b6b;
  padding: 0;
  line-height: 1;
`;

/* Submit button (keeps your original gradient and style) */
const Button = styled.button`
  padding: 0.95rem 1rem;
  background: linear-gradient(90deg,#df0043,#9a34ff);
  border: none;
  color: white;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 0.25rem;
  transition: transform 0.08s, box-shadow 0.12s;
  &:active { transform: translateY(1px); }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

/* small helper text and error */
const Small = styled.small`
  display:block; margin-top:0.5rem; color: #666; font-size: 0.82rem;
`;

const ErrorBox = styled.div`
  background: #ffecec; color: #8b0000; padding: 0.6rem 0.8rem; border-radius: 6px;
  font-size: 0.9rem; margin-bottom: 0.5rem;
`;

/* Footer kept as-is (white text on blue overlay) */
const Footer = styled.footer`
  position: absolute; bottom: 1rem; font-size: 0.8rem; color: #fff; text-align: center;
`;

/* helper to map role to route; exact routes you specified kept */
const routeForRole = (role) => {
  if (!role) return "/";
  switch ((role || "").toLowerCase()) {
    case "admin": return "/admin-dashboard";
    case "student": return "/dashboard";
    case "teacher": return "/teacher-dashboard";
    case "principal": return "/principal-dashboard";
    case "operator": return "/hostel-dashboard";
    default: return "/";
  }
};

/**
 * parseJwt - safely decode JWT payload (no validation)
 * returns an object or null
 */
const parseJwt = (token) => {
  try {
    if (!token) return null;
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = parts[1];
    // base64url -> base64
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    // pad base64 string
    const pad = base64.length % 4;
    const padded = base64 + (pad ? "=".repeat(4 - pad) : "");
    const decoded = atob(padded);
    // decode UTF-8
    try {
      return JSON.parse(decodeURIComponent(escape(decoded)));
    } catch {
      return JSON.parse(decoded);
    }
  } catch (e) {
    // fallback
    return null;
  }
};

const LoginPage = () => {
  const navigate = useNavigate();

  const [uniqueId, setUniqueId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // eye toggle (hide/show)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // inside src/pages/LoginPage.jsx -> replace submitLogin with this
const submitLogin = async (e) => {
  e.preventDefault();
  setError("");

  if (!uniqueId.trim() || !password) {
    setError("Please enter both Unique ID and password.");
    return;
  }

  setLoading(true);
  try {
    const res = await loginUser({ unique_id: uniqueId.trim(), password });
    console.debug("Raw login response:", res);

    // normalize axios vs direct
    const resp = res?.data ?? res ?? {};

    // try common token locations
    let token =
      resp.token ||
      resp.authToken ||
      resp.access_token ||
      resp.accessToken ||
      resp.data?.token ||
      resp.data?.authToken ||
      resp.result?.token ||
      null;

    // sometimes token inside 'user' (rare)
    if (!token) token = resp.user?.token || resp.user?.authToken || null;

    // if token looks like a jwt without Bearer, add prefix
    if (token && !token.startsWith("Bearer ")) token = `Bearer ${token}`;

    // refresh token
    const refreshToken =
      resp.refreshToken || resp.refresh_token || resp.data?.refreshToken || null;

    // user payload
    const user =
      resp.user || resp.data?.user || resp.result?.user || resp.userData || null;

    // role: prefer explicit, fallback to token payload
    let role =
      resp.role ||
      resp.data?.role ||
      (user && user.role) ||
      null;

    if (!role && token) {
      try {
        const payload = JSON.parse(atob(token.split(" ")[1].split(".")[1]));
        role = payload.role || payload.user?.role || role;
      } catch (err) {
        // ignore
      }
    }

    if (!token) {
      setError(resp.message || "Login failed: token missing in response.");
      setLoading(false);
      return;
    }

    // final normalized user object: if not provided, try token payload
    let finalUser = user;
    if (!finalUser) {
      try {
        const payload = JSON.parse(atob(token.split(" ")[1].split(".")[1]));
        finalUser = payload.user || { unique_id: payload.unique_id || payload.sub, role: payload.role };
      } catch (err) {
        // ignore
      }
    }

    // Persist *consistent* keys (defensive)
    try {
      localStorage.setItem("authToken", token);
      localStorage.setItem("token", token); // some code expects this
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
      if (finalUser) localStorage.setItem("user", JSON.stringify(finalUser));
      if (role) localStorage.setItem("role", (typeof role === "string" ? role : JSON.stringify(role)).toLowerCase());
    } catch (storageErr) {
      console.warn("Could not persist auth to localStorage:", storageErr);
    }

    console.log("Login stored:", { authToken: !!localStorage.getItem("authToken"), role: localStorage.getItem("role"), user: localStorage.getItem("user") });

    navigate(routeForRole(localStorage.getItem("role")));
  } catch (err) {
    console.error("Login error:", err);
    const serverMessage =
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      err?.message ||
      "Unable to reach server. Please try again later.";
    setError(serverMessage);
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      <GlobalStyle />
      <Container>
        <BackgroundImage>
          <img src={bg} alt="Background" />
        </BackgroundImage>
        <BackgroundOverlay />
        <BackgroundCurve>
          <svg viewBox="0 0 1440 1024" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M-4,0 C300,500 1640,100 1440,700 L1440,0 Z" fill="#DF0043" />
          </svg>
        </BackgroundCurve>

        <LogoSection>
          <img src={logo} alt="Logo" />
        </LogoSection>

        <LoginBox aria-labelledby="login-title" role="form">
          <Title id="login-title">Login</Title>
          <Sub>Login with your Unique ID and password</Sub>

          {error && <ErrorBox role="alert" id="login-error">{error}</ErrorBox>}

          <Form onSubmit={submitLogin} aria-describedby={error ? "login-error" : undefined}>
            <label htmlFor="uniqueId" style={{ textAlign: "left", width: "100%", fontSize: 13, color: "#444", marginBottom: 6 }}>Unique ID</label>
            <FieldWrapper>
              <Input
                id="uniqueId"
                value={uniqueId}
                onChange={(e) => setUniqueId(e.target.value)}
                placeholder="Enter your unique id (eg. admission_no or emp_id)"
                autoComplete="username"
                aria-label="Unique ID"
                required
              />
            </FieldWrapper>

            <label htmlFor="password" style={{ textAlign: "left", width: "100%", fontSize: 13, color: "#444", marginTop: 8, marginBottom: 6 }}>Password</label>
            <FieldWrapper>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                aria-label="Password"
                required
              />

              {/* Eye icon toggle - keeps look subtle and matches other UI elements */}
              <EyeToggle
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword(s => !s)}
              >
                {showPassword ? (
                  /* eye-off (subtle) */
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.94 17.94A10.94 10.94 0 0112 20c-5 0-9.27-3-11-7 1.21-2.81 3.8-5.01 7.04-6.07" stroke="#6b6b6b" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 2l20 20" stroke="#6b6b6b" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  /* eye */
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" stroke="#6b6b6b" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3" stroke="#6b6b6b" strokeWidth="1.4" />
                  </svg>
                )}
              </EyeToggle>
            </FieldWrapper>

            <Button type="submit" disabled={loading} aria-busy={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <Small>Forgot password? Implement reset flow on the backend and link here.</Small>
          </Form>
        </LoginBox>

        <Footer>© 2024 Campus Sync School Management</Footer>
      </Container>
    </>
  );
};

export default LoginPage;
