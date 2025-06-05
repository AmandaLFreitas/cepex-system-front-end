
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-slate-900 border-slate-700 mt-auto">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="text-sm text-slate-400">
          © 2025 Faculdade Connect. Todos os direitos reservados.
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-400 hover:text-white"
        >
          <Star className="h-4 w-4 mr-2" />
          Avaliar plataforma
        </Button>
      </div>
    </footer>
  );
};

export default Footer;
