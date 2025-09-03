import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Fox } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary p-4">
      <div className="mb-8 flex items-center gap-4 text-primary">
        <Fox className="h-12 w-12" />
        <h1 className="font-headline text-5xl font-bold">FoxDash</h1>
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Registro</CardTitle>
          <CardDescription>
            Crie sua conta para começar a usar o sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="full-name">Nome Completo</Label>
              <Input id="full-name" placeholder="Seu Nome" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nome@exemplo.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" required />
            </div>
            <Button asChild type="submit" className="w-full">
              <Link href="/dashboard">Criar Conta</Link>
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Já tem uma conta?{' '}
            <Link href="/" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
