import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AuthModal from "@/components/AuthModal";
import LoadingSpinner from "@/components/LoadingSpinner";

const Login = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate("/todos", { replace: true });
    }
  }, [user, loading, navigate]);

  if (showSpinner) return <LoadingSpinner />;

  return (
    <AuthModal
      open={true}
      isLogin={true}
      onModeSwitch={isLogin => {
        if (!isLogin) navigate("/register", { replace: true });
      }}
      onClose={() => setShowSpinner(true)}
    />
  );
};

export default Login; 