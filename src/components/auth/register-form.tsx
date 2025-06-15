"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar32 } from "@/components/auth/calendar-32";

type RegisterFormProps = React.HTMLAttributes<HTMLDivElement>;

export function RegisterForm({ className, ...props }: RegisterFormProps) {
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [error, setError] = useState("");
  const router = useRouter();

  function calculateAge(birthDate: Date) {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name"));
    const username = String(formData.get("username"));
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    if (!birthDate) {
      setError("Por favor, selecione sua data de nascimento.");
      return;
    }
    const age = calculateAge(birthDate);

    try {
      await register({ name, username, email, password, age });
      router.replace("/dashboard");
    } catch (error: any) {
      if (error.response && typeof error.response.data === "string") {
        setError(error.response.data);
      } else {
        setError("Erro ao registrar.");
      }
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Crie sua conta</h1>
                <p className="text-muted-foreground text-balance">
                  Comece a usar o Flori$ agora mesmo!
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Seu nome completo"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="username">Nome de usuário</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  placeholder="seu-usuario"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="seuemail@exemplo.com"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Crie uma senha forte"
                />
              </div>
              {/* Componente customizado para a data */}
              <Calendar32
                value={birthDate}
                onChange={setBirthDate}
                label="Data de nascimento"
              />
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <Button type="submit" className="w-full">
                Registrar
              </Button>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-card px-2 text-muted-foreground">
                  Ou continue com
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <Button variant="outline" type="button" className="w-full">
                  {/* Google svg aqui */}
                  Google
                </Button>
              </div>
              <div className="text-center text-sm">
                Já tem uma conta?{" "}
                <Link
                  href="/auth/login"
                  className="underline underline-offset-4"
                >
                  Faça login
                </Link>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <Image
              src="/register-image.jpg"
              alt="Register Wallpaper"
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
