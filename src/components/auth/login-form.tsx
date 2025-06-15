"use client";

import React, { useState, useContext } from "react";
import { AuthService } from "@/services/authService";
import { AuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface LoginFormProps {
  className?: string;
}

export function LoginForm({ className }: LoginFormProps) {
  const router = useRouter();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await AuthService.login({
        login: email,
        password: senha,
      });

      login({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        user: response.user,
      });

      router.push("/private/dashboard");
    } catch (err: any) {
      console.error("Erro ao fazer login:", err);
      setError("Usuário ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn("flex min-h-screen items-center justify-center", className)}
    >
      <Card className="w-full max-w-md p-8 shadow-lg">
        <CardContent className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Bem-vindo ao Flori$</h1>
            <p className="text-sm text-muted-foreground">
              Entre com suas credenciais
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seuemail@exemplo.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                placeholder="********"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="text-center text-sm">
            Ainda não tem uma conta?{" "}
            <a
              href="/auth/register"
              className="underline underline-offset-4 font-medium"
            >
              Cadastre-se
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
