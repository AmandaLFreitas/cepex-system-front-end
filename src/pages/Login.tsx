import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../service/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/components/ui/modal/ThemeProvider";
import { useAuth } from "@/contexts/AuthContext";
import { Sun, Moon } from "lucide-react";

const Login = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const { login: authLogin, user, isAuthenticated } = useAuth();

  // Redireciona para o dashboard se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!login || !password) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha o login e a senha.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post("/auth/login", {
        login: login,
        password: password,
      });

      const { token } = response.data;

      // Usa a função de login do AuthContext
      authLogin(token);

      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo, ${user?.login}!`,
      });

      navigate("/"); // Redireciona para o dashboard
    } catch (error) {
      console.error("Falha no login:", error);
      toast({
        title: "Falha no Login",
        description: "Credenciais inválidas. Verifique seu login e senha.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Se já estiver autenticado, não renderiza o formulário
  if (isAuthenticated) {
    return null;
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
                Acesso ao Sistema
              </h1>
              <p className="text-muted-foreground text-sm">
                Use suas credenciais para entrar
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login" className="text-foreground">
                  Login
                </Label>
                <Input
                  id="login"
                  type="text"
                  placeholder="seu.login"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background border-border"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#EC0444] hover:bg-[#EC0444]/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
            <div className="text-center mt-6 space-y-2">
              <a
                href="/forgot-password"
                className="text-sm text-muted-foreground hover:text-foreground underline block"
              >
                Esqueceu sua senha?
              </a>
              <a
                href="/register"
                className="text-sm text-muted-foreground hover:text-foreground underline block"
              >
                Não tem uma conta? Cadastre-se
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
