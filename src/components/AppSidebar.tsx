import { useState } from "react";
import {
  Inbox,
  Calendar,
  CalendarClock,
  CheckCircle,
  Plus,
  Search,
  User,
  AlertCircle,
  HelpCircle,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import AddTodoModal from "./AddTodoModal";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";

interface AppSidebarProps {
  onSectionChange: (section: string) => void;
  currentSection: string;
  todoCounts: {
    inbox: number;
    today: number;
    upcoming: number;
    overdue: number;
    noDeadline: number;
    completed: number;
  };
  onAdd: (
    title: string,
    description?: string,
    priority?: "low" | "medium" | "high",
    deadline_at?: string
  ) => void;
}

export function AppSidebar({
  onSectionChange,
  currentSection,
  todoCounts,
  onAdd,
}: AppSidebarProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { state } = useSidebar();
  const { logout, user } = useAuth();

  const mainItems = [
    {
      title: "Inbox",
      key: "inbox",
      icon: Inbox,
      count: todoCounts.inbox,
      color: "text-blue-600",
    },
    {
      title: "Today",
      key: "today",
      icon: Calendar,
      count: todoCounts.today,
      color: "text-green-600",
    },
    {
      title: "Upcoming",
      key: "upcoming",
      icon: CalendarClock,
      count: todoCounts.upcoming,
      color: "text-orange-600",
    },
    {
      title: "Overdue",
      key: "overdue",
      icon: AlertCircle,
      count: todoCounts.overdue,
      color: "text-red-600",
    },
    {
      title: "Someday",
      key: "nodeadline",
      icon: HelpCircle,
      count: todoCounts.noDeadline,
      color: "text-blue-500",
    },
    {
      title: "Completed",
      key: "completed",
      icon: CheckCircle,
      count: todoCounts.completed,
      color: "text-gray-600",
    },
  ];

  const isCollapsed = state === "collapsed";

  // Helper for Add Task button, only show in Inbox
  const addTaskButton = (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        className="w-full justify-start rounded-lg px-3 py-0 text-sm text-gray-700 hover:bg-gray-100"
      >
        <button onClick={() => setIsAddModalOpen(true)}>
          <div className="flex items-center gap-3">
            <Plus className="w-5 h-5 text-white bg-red-500 rounded-full p-1" />
            {!isCollapsed && <span>Add task</span>}
          </div>
        </button>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  return (
    <Sidebar
      className={`${
        isCollapsed ? "w-[60px]" : "w-[270px]"
      } border-none bg-gray-50/50 transition-all duration-200`}
    >
      <SidebarHeader className="p-4 relative">
        {/* Avatar và Tên */}
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          {!isCollapsed && (
            <span className="font-medium text-gray-900">{user?.user_metadata?.username || user?.username || 'User'}</span>
          )}
        </div>

        {/* Nút đóng/mở ở góc phải */}
        <div className="absolute top-4 right-4">
          <SidebarTrigger className="w-10 h-10" />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-1 py-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Add Task Button: chỉ hiển thị ở Inbox */}
              {currentSection === "inbox" ? addTaskButton : null}

              {/* Main Menu Items */}
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    asChild
                    className={`w-full justify-between rounded-lg px-3 py-2 text-sm hover:bg-gray-100 ${
                      currentSection === item.key
                        ? "bg-red-50 text-red-600 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    <button onClick={() => onSectionChange(item.key)}>
                      <div className="flex items-center gap-3">
                        <item.icon
                          className={`w-4 h-4 ${
                            currentSection === item.key
                              ? "text-red-600"
                              : item.color
                          }`}
                        />
                        {!isCollapsed && <span>{item.title}</span>}
                      </div>
                      {!isCollapsed && item.count > 0 && (
                        <span className="text-xs text-gray-500 font-normal">
                          {item.count}
                        </span>
                      )}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <AddTodoModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={onAdd}
      />

      {/* Nút Đăng xuất ở cuối sidebar */}
      <div className="mt-auto mb-4 px-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="w-full justify-start rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <button onClick={logout}>
                <div className="flex items-center gap-3">
                  <LogOut className="w-5 h-5 text-gray-500" />
                  {!isCollapsed && <span>Logout</span>}
                </div>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
    </Sidebar>
  );
}
