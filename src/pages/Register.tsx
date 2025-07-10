import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AuthModal from "@/components/AuthModal";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/todos", { replace: true });
    }
  }, [user, loading, navigate]);

  return (
    <AuthModal
      open={true}
      isLogin={false}
      onModeSwitch={isLogin => {
        if (isLogin) navigate("/login", { replace: true });
      }}
      onRegisterSuccess={() => {
        toast({
          title: "Registration successful!",
          description: "You can now log in with your new account.",
        });
        navigate("/login", { replace: true });
      }}
      onClose={() => {}}
    />
  );
};

export default Register; 