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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    login: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      role: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro de validação",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      await api.post("/auth/register", {
        login: formData.login,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      toast({
        title: "Conta criada com sucesso!",
        description: "Você será redirecionado para a página de login.",
      });

      navigate("/login");
    } catch (error) {
      toast({
        title: "Erro ao criar conta",
        description: "Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-foreground">Registro</h1>
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
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">
                  Nome Completo
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Seu nome completo"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-background border-border"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login" className="text-foreground">
                  Login
                </Label>
                <Input
                  id="login"
                  name="login"
                  type="text"
                  placeholder="Seu login"
                  value={formData.login}
                  onChange={handleChange}
                  className="bg-background border-border"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-background border-border"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-foreground">
                  Tipo de Usuário
                </Label>
                <Select onValueChange={handleRoleChange} required>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Selecione o tipo de usuário" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STUDENT">Estudante</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">
                  Senha
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-background border-border"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground">
                  Confirmar Senha
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="bg-background border-border"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#EC0444] hover:bg-[#EC0444]/90"
                disabled={isLoading}
              >
                {isLoading ? "Registrando..." : "Registrar"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Já tem uma conta?{" "}
                <Button
                  variant="link"
                  className="text-[#EC0444] hover:text-[#EC0444]/90 p-0 h-auto"
                  onClick={() => navigate("/login")}
                >
                  Faça login
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
