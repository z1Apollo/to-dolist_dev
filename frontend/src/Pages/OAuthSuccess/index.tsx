import { useEffect } from "react";

export default function OAuthSuccess() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const token = params.get("token");
    const userParam = params.get("user");

    if (token && userParam) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", decodeURIComponent(userParam));

      window.location.href = "/"; 
    } else {
      window.location.href = "/login";
    }
  }, []);

  return <p>Autenticando...</p>;
}