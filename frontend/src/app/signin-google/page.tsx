"use client";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google"; 

export default function LoginGooglePage() {
  const clientId =
    "360777340765-s7h358nts32dhe0adg2hgcpg6pcrkonl.apps.googleusercontent.com";
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="flex flex-col items-center justify-center p-4">
        <h1 className="mb-4 text-xl font-bold">Đăng nhập</h1>

        <GoogleLogin
          onSuccess={(credentialResponse) => {
            console.log("Google response:", credentialResponse);
            const idToken = credentialResponse.credential;

            fetch("http://localhost:5151/api/auth/signin-google", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ idToken: idToken }),
            })
              .then((res) => {
                if (!res.ok) throw new Error("Auth error");
                return res.json();
              })
              .then((data) => {
                localStorage.setItem("accessToken", data.token);
                console.log("Login thành công:", data);
                window.location.href = "/dashboard";
              })
              .catch((err) => {
                console.error(err);
                alert("Đăng nhập thất bại.");
              });
          }}
          onError={() => {
            console.log("Login Failed");
          }}
        />
      </div>
    </GoogleOAuthProvider>
  );
}
