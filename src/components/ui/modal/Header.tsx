import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/modal/ThemeProvider";
import { Sun, Moon } from "lucide-react";

const Header = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="text-muted-foreground hover:text-foreground"
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>
    </div>
  );
};

export default Header;
