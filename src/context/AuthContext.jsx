import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!token) return;

    const timer = setTimeout(() => {
      handleLogout();
      alert("You have been logged out due to inactivity");
    }, 30 * 60 * 1000);

    return () => clearTimeout(timer);
  }, [token]);

  async function handleLogin(email, password) {
    const res = await fetch("https://dummyjson.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: email.split("@")[0],
        password: password,
        expiresInMins: 30,
      }),
    });

    if (!res.ok) {
      throw new Error("Invalid email or password");
    }

    const data = await res.json();

    setToken(data.accessToken);
    setUser({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      image: data.image,
    });

    localStorage.setItem("token", data.accessToken);
    localStorage.setItem("user", JSON.stringify({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      image: data.image,
    }));
  }

  function handleLogout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  return (
    <AuthContext.Provider value={{ token, user, handleLogin, handleLogout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}