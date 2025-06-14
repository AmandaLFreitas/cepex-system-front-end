import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/modal/ThemeProvider";
import { Sun, Moon, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado do sistema.",
    });
    navigate("/login");
  };

  return (
    <header className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-[#EC0444] rounded"></div>
            </div>
            <div className="ml-4">
              <span className="text-xl font-bold text-foreground">
                CEPEX SYSTEM
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {user.login}
                </span>
                <span className="mx-2">•</span>
                <span className="capitalize">{user.role.toLowerCase()}</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            {user && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
