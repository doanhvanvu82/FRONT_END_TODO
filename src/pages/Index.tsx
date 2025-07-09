import { useAuth } from "@/hooks/use-auth";
import TodoApp from "@/components/TodoApp";
import AuthModal from "@/components/AuthModal";

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // hoặc có thể trả về spinner nếu muốn
  }

  if (!user) {
    return <AuthModal open={true} onClose={() => {}} />;
  }

  return <TodoApp />;
};

export default Index;
