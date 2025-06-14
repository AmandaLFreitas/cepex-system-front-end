import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import {
  Menu,
  ChevronLeft,
  ChevronRight,
  Home,
  Users,
  BookOpen,
  GraduationCap,
  FileText,
  CheckCircle,
  Award,
  User,
  LogOut,
} from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const routes = [
    {
      href: "/",
      label: "Dashboard",
      icon: Home,
    },
    {
      href: "/usuarios",
      label: "Usuários",
      icon: Users,
      roles: ["ADMIN"],
    },
    {
      href: "/atividades",
      label: "Atividades",
      icon: BookOpen,
    },
    {
      href: "/monitorias",
      label: "Monitorias",
      icon: GraduationCap,
    },
    {
      href: "/projetos-pesquisa",
      label: "Projetos de Pesquisa",
      icon: FileText,
    },
    {
      href: "/projetos-extensao",
      label: "Projetos de Extensão",
      icon: FileText,
    },
    {
      href: "/aprovacoes",
      label: "Aprovações",
      icon: CheckCircle,
    },
    {
      href: "/certificados",
      label: "Certificados",
      icon: Award,
    },
  ];

  const UserMenu = () => (
    <div className="border-t p-4 flex flex-col items-center gap-2">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
        <User className="h-4 w-4" />
        <span className="truncate text-start font-bold">{user?.login}</span>
      </div>
      <Button
        variant="ghost"
        className="justify-center w-full text-start border-t"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4 mr-2" />
        <span className="text-sm">Sair</span>
      </Button>
    </div>
  );

  const SidebarContent = () => (
    <div className="flex h-full flex-col gap-2">
      <div className="flex h-[60px] items-center justify-between border-b px-6">
        <Link
          to="/"
          className={cn(
            "flex items-center gap-2 font-semibold",
            isCollapsed && "hidden"
          )}
        >
          <div className="w-6 h-6 bg-[#EC0444] rounded"></div>
          <span className="text-xl">CEPEX SYSTEM</span>
        </Link>
        {!isCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(true)}
            className="hidden lg:flex h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 p-2">
          {routes.map((route) => {
            if (route.roles && !route.roles.includes(user?.role || "")) {
              return null;
            }
            return (
              <Link
                key={route.href}
                to={route.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                  location.pathname === route.href
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground",
                  isCollapsed && "justify-center"
                )}
                title={isCollapsed ? route.label : undefined}
              >
                <route.icon className="h-4 w-4" />
                {!isCollapsed && <span>{route.label}</span>}
              </Link>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      {!isCollapsed ? (
        <div
          className={cn(
            "hidden border-r bg-background lg:flex flex-col w-64",
            className
          )}
        >
          <SidebarContent />
          <UserMenu />
        </div>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(false)}
          className="hidden lg:flex fixed top-4 left-4 z-50 h-10 w-10 border bg-background shadow"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      )}

      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed top-4 left-4 z-50"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <div className="flex flex-col h-full">
            <SidebarContent />
            <UserMenu />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
