import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function useEmailVerifiedPageLogic() {
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying your email...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (!token) {
      setMessage("Invalid verification link.");
      setLoading(false);
      return;
    }

    fetch(`/auth/verify-email?token=${token}`)
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.detail || "Verification failed");
        }
        return res.json();
      })
      .then(() => {
        setMessage("Email verified successfully! You can now login.");
      })
      .catch((err: Error) => {
        setMessage(err.message);
      })
      .finally(() => setLoading(false));
  }, [location.search]);

  return { message, loading, navigate };
}


export default function EmailVerifiedPage() {

    const {loading, message, navigate} = useEmailVerifiedPageLogic();
  // all the above is logic  states , can I separate them into  custome hook so that current function only render  ? answer is yes, but why  ?  answer is separation of concerns , we want to separate the logic from the UI rendering so that we can reuse the logic in other components if needed and also make the component more readable and maintainable.  --- IGNORE ---
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg text-center">
      <h2 className="text-xl font-semibold mb-4">Email Verification</h2>
      {loading ? <p>Verifying...</p> : <p>{message}</p>}
      {!loading && (
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
          onClick={() => navigate("/Login")}
        >
          Go to Login
        </button>
      )}
    </div>
  );
}
export { useEmailVerifiedPageLogic };