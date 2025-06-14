import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../service/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/components/ui/modal/ThemeProvider";
import { Sun, Moon } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post("/auth/forgot-password", {
        email: email,
      });

      setIsEmailSent(true);
      toast({
        title: "Email enviado!",
        description: "Verifique sua caixa de entrada para recuperar sua senha.",
      });
    } catch (error) {
      console.error("Falha ao enviar email:", error);
      toast({
        title: "Falha ao enviar email",
        description:
          "Não foi possível enviar o email de recuperação. Verifique o endereço e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="absolute top-4 right-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
          </Button>
        </div>
        <Card className="bg-card border-border w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Email Enviado!
            </h1>
            <p className="text-muted-foreground mb-6">
              Verifique sua caixa de entrada para recuperar sua senha.
            </p>
            <Button
              onClick={() => navigate("/login")}
              className="bg-[#EC0444] hover:bg-[#EC0444]/90"
            >
              Voltar para o Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
        </Button>
      </div>
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <div className="w-6 h-6 bg-[#EC0444] rounded"></div>
          <span className="text-xl font-bold text-foreground ml-2">
            CEPEX SYSTEM
          </span>
        </div>
        <Card className="bg-card border-border">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Recuperar Senha
              </h1>
              <p className="text-muted-foreground text-sm">
                Digite seu email para receber as instruções de recuperação
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background border-border"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#EC0444] hover:bg-[#EC0444]/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Enviando..." : "Enviar Email"}
              </Button>
            </form>
            <div className="text-center mt-6">
              <a
                href="/login"
                className="text-sm text-muted-foreground hover:text-foreground underline"
              >
                Voltar para o Login
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
