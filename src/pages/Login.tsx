
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/components/ThemeProvider";
import { Sun, Moon, LogOut } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const userTypes = [
    { value: "aluno", label: "Aluno", email: "aluno@faculdade.com" },
    { value: "professor", label: "Professor", email: "professor@faculdade.com" },
    { value: "coordenacao", label: "Coordenação", email: "coordenacao@faculdade.com" },
    { value: "secretaria", label: "Secretária", email: "secretaria@faculdade.com" },
    { value: "admin", label: "Admin", email: "admin@faculdade.com" }
  ];

  const handleUserTypeChange = (value: string) => {
    setUserType(value);
    const selectedUser = userTypes.find(user => user.value === value);
    if (selectedUser) {
      setEmail(selectedUser.email);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password || !userType) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const selectedUser = userTypes.find(user => user.email === email);
    if (!selectedUser || selectedUser.value !== userType) {
      toast({
        title: "Credenciais inválidas",
        description: "Email não corresponde ao tipo de usuário selecionado",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Simular login bem-sucedido
    setTimeout(() => {
      setCurrentUser(selectedUser);
      setIsLoggedIn(true);
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo ao CEPEX System como ${selectedUser.label}`,
      });
      navigate("/");
      setIsLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setEmail("");
    setPassword("");
    setUserType("");
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado do sistema",
    });
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="absolute top-4 right-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="text-muted-foreground hover:text-foreground"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="border-border"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <Card className="bg-card border-border">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Bem-vindo ao CEPEX SYSTEM
            </h1>
            <p className="text-muted-foreground mb-4">
              Logado como: <strong>{currentUser?.label}</strong>
            </p>
            <p className="text-muted-foreground mb-6">
              Email: {currentUser?.email}
            </p>
            <Button 
              onClick={() => navigate("/")} 
              className="bg-[#EC0444] hover:bg-[#EC0444]/90"
            >
              Acessar Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="text-muted-foreground hover:text-foreground"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          <Button variant="outline" className="border-border">
            Login
          </Button>
        </div>
      </div>

      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-[#EC0444] rounded"></div>
            <span className="text-xl font-bold text-foreground">CEPEX SYSTEM</span>
          </div>
        </div>

        <Card className="bg-card border-border">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-foreground mb-2">CEPEX SYSTEM</h1>
              <p className="text-muted-foreground text-sm">
                Acesso ao sistema de gestão acadêmica
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userType" className="text-foreground">
                  Tipo de Usuário
                </Label>
                <Select onValueChange={handleUserTypeChange} value={userType}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Selecione o tipo de usuário" />
                  </SelectTrigger>
                  <SelectContent>
                    {userTypes.map((user) => (
                      <SelectItem key={user.value} value={user.value}>
                        {user.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.email@faculdade.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background border-border"
                  readOnly={!!userType}
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

            <div className="text-center mt-6">
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground underline"
              >
                Esqueceu sua senha?
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
