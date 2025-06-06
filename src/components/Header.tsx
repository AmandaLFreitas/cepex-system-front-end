
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { Sun, Moon, User } from "lucide-react";

const Header = () => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const navItems = [
    { path: "/", label: "Início" },
    { path: "/usuarios", label: "Usuários" },
    { path: "/atividades", label: "Atividades" },
    { path: "/aprovacoes", label: "Aprovações" },
    { path: "/certificados", label: "Certificados" },
  ];

  return (
    <header className="border-b bg-card border-border">
      <div className="flex h-16 items-center px-40 justify-between">
        <div className="flex items-center space-x-2">
          <div 
            className="w-12 h-12 rounded"
            style={{
              backgroundImage: `url(${'/biopark_logo.jpg'})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
            
            ></div>
          <span className="text-xl font-bold text-foreground">CEPEX SYSTEM</span>
        </div>

        <nav className="hidden md:flex items-center justify-center space-x-8 mx-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm transition-colors px-3 py-2 rounded-md ${
                location.pathname === item.path
                  ? "text-foreground bg-[#EC0444] text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="text-muted-foreground hover:text-foreground"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm text-muted-foreground">P</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
