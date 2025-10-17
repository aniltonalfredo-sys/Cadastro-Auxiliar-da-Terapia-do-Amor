import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Heart, Lock, User } from "lucide-react";
import { toast } from "sonner";

interface LoginPageProps {
  onLogin: (username: string, password: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    setIsLoading(true);
    
    // Simular um pequeno delay para melhor UX
    setTimeout(() => {
      onLogin(username, password);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white flex items-center justify-center p-6">
      {/* Background decorative hearts */}
      <div className="absolute top-10 left-10 text-6xl opacity-10 animate-pulse">💕</div>
      <div className="absolute top-20 right-20 text-5xl opacity-10 animate-pulse delay-300">💜</div>
      <div className="absolute bottom-20 left-1/4 text-4xl opacity-10 animate-pulse delay-500">❤️</div>
      <div className="absolute bottom-10 right-1/3 text-6xl opacity-10 animate-pulse delay-700">💗</div>

      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#9333EA] via-[#A855F7] to-[#C084FC] rounded-2xl shadow-2xl shadow-purple-300 mb-4">
            <Heart className="w-10 h-10 text-white" fill="white" />
          </div>
          <h1 className="bg-gradient-to-r from-[#9333EA] to-[#C084FC] bg-clip-text text-transparent mb-2">
            Terapia do Amor
          </h1>
          <p className="text-purple-600 flex items-center justify-center gap-2">
            <Heart className="w-4 h-4 fill-purple-400 text-purple-400" />
            Painel Administrativo de Auxiliares
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl shadow-purple-200/50 border border-purple-100 p-8">
          <div className="mb-6 text-center">
            <h2 className="text-purple-900 mb-2">Bem-vindo de volta! 💜</h2>
            <p className="text-sm text-purple-600">
              Entre com suas credenciais para acessar o sistema
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-purple-900">
                Usuário
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Digite seu usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-11 bg-purple-50/50 border-purple-200 focus:border-purple-400 focus:ring-purple-300"
                  disabled={isLoading}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-purple-900">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 bg-purple-50/50 border-purple-200 focus:border-purple-400 focus:ring-purple-300"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#9333EA] to-[#A855F7] hover:from-[#7E22CE] hover:to-[#9333EA] shadow-lg shadow-purple-300 h-11"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Entrando...
                </>
              ) : (
                <>
                  <Heart className="w-5 h-5 mr-2" fill="white" />
                  Entrar no Sistema
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-purple-100">
            <p className="text-xs text-center text-purple-500">
              🔐 Sistema seguro e protegido
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-purple-400 mt-6">
          © 2024 Terapia do Amor • Painel de Auxiliares
        </p>
      </div>
    </div>
  );
}
