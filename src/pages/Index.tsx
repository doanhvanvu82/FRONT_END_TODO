import { useAuth } from "@/hooks/use-auth";
import TodoApp from "@/components/TodoApp";
import AuthModal from "@/components/AuthModal";
import LoadingSpinner from "@/components/LoadingSpinner";

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <AuthModal open={true} onClose={() => {}} />;
  }

  return <TodoApp />;
};

export default Index;
