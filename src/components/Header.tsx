
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
    <header className="border-b bg-slate-900 border-slate-700">
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-pink-500 rounded"></div>
          <span className="text-xl font-bold text-white">CEPEX SYSTEM</span>
        </div>

        <nav className="hidden md:flex items-center space-x-6 mx-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm transition-colors hover:text-white ${
                location.pathname === item.path
                  ? "text-white border-b-2 border-pink-500 pb-4"
                  : "text-slate-300"
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
            className="text-slate-300 hover:text-white"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm text-slate-300">P</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
