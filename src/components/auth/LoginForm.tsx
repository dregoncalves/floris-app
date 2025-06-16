"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

type LoginFormProps = React.HTMLAttributes<HTMLDivElement>;

export function LoginForm({ className, ...props }: LoginFormProps) {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    // Pega o campo com name="email" (pode ser e-mail ou username)
    const loginField = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      // 1. Login: recebe accessToken e refreshToken
      const response = await api.post("/auth/login", {
        login: loginField,
        password,
      });
      const { accessToken, refreshToken } = response.data;

      // 2. Busca o usuário autenticado
      const meResponse = await api.get("/users/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const user = meResponse.data;

      // 3. Salva no contexto Auth
      login({ accessToken, refreshToken, user });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao fazer login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Bem-vindo de volta!</h1>
                <p className="text-muted-foreground text-balance">
                  Acesse sua conta no Flori$
                </p>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email">E-mail ou usuário</Label>
                <Input
                  id="email"
                  name="email" // <- ESSENCIAL para funcionar com FormData
                  type="text"
                  placeholder="Digite seu e-mail ou usuário"
                  required
                />
              </div>

              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Senha</Label>
                  <Link
                    href="/forgot-password"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Esqueceu sua senha?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password" // <- ESSENCIAL para funcionar com FormData
                  type="password"
                  required
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
              </Button>

              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-card px-2 text-muted-foreground">
                  Ou continue com
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <Button variant="outline" type="button" className="w-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="100"
                    height="100"
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="#FFC107"
                      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                    ></path>
                    <path
                      fill="#FF3D00"
                      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                    ></path>
                    <path
                      fill="#4CAF50"
                      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                    ></path>
                    <path
                      fill="#1976D2"
                      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                    ></path>
                  </svg>
                  Google
                </Button>
              </div>

              <div className="text-center text-sm">
                Ainda não tem uma conta?{" "}
                <Link
                  href="/auth/register"
                  className="underline underline-offset-4"
                >
                  Cadastre-se
                </Link>
              </div>
            </div>
          </form>

          <div className="relative hidden bg-muted md:block">
            <Image
              src="/login-image.jpg"
              alt="Login Wallpaper"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-xs text-muted-foreground text-balance *:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-primary">
        Ao continuar, você concorda com nossos{" "}
        <Link href="/terms">Termos de Uso</Link> e{" "}
        <Link href="/privacy">Política de Privacidade</Link>.
      </div>
    </div>
  );
}
