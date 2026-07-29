'use client';

import {
  Button,
  Field,
  Heading,
  Input,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { type SubmitEvent, useState } from 'react';
import { toaster } from '@/components/ui/toaster';

export default function Login(): React.JSX.Element {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (
    event: SubmitEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message ?? 'Não foi possível entrar');
        return;
      }
      toaster.create({
        title: 'Login realizado com sucesso',
        type: 'success',
      });
      router.push('/');
      router.refresh();
    } catch {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Stack gap="8">
      <Stack gap="1" textAlign="center">
        <Heading as="h1" size="xl">
          Entrar
        </Heading>
        <Text color="fg.muted">Acesse sua conta para continuar</Text>
      </Stack>

      <Stack asChild gap="4">
        <form onSubmit={handleSubmit}>
          <Field.Root required>
            <Field.Label>
              E-mail <Field.RequiredIndicator />
            </Field.Label>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="voce@exemplo.com"
              autoComplete="email"
            />
          </Field.Root>

          <Field.Root invalid={!!error} required>
            <Field.Label>
              Senha <Field.RequiredIndicator />
            </Field.Label>
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            {error && <Field.ErrorText>{error}</Field.ErrorText>}
          </Field.Root>

          <Button type="submit" size="lg" loading={isLoading}>
            Entrar
          </Button>
        </form>
      </Stack>

      <Text textAlign="center" color="fg.muted">
        Não tem uma conta?{' '}
        <Link asChild>
          <NextLink href="/account/create">Criar conta</NextLink>
        </Link>
      </Text>
    </Stack>
  );
}
