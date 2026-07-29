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

export default function Create(): React.JSX.Element {
  const router = useRouter();
  const [name, setName] = useState('');
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
      const response = await fetch('/api/v1/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message ?? 'Não foi possível criar sua conta');
        return;
      }
      toaster.create({ title: 'Conta criada com sucesso', type: 'success' });
      router.push('/account/login');
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
          Criar conta
        </Heading>
        <Text color="fg.muted">
          Comece a organizar suas finanças em minutos
        </Text>
      </Stack>

      <Stack asChild gap="4">
        <form onSubmit={handleSubmit}>
          <Field.Root required>
            <Field.Label>
              Nome <Field.RequiredIndicator />
            </Field.Label>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Seu nome"
              autoComplete="name"
            />
          </Field.Root>

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
              placeholder="Mínimo de 8 caracteres"
              autoComplete="new-password"
            />
            {error ? (
              <Field.ErrorText>{error}</Field.ErrorText>
            ) : (
              <Field.HelperText>
                Use pelo menos 8 caracteres.
              </Field.HelperText>
            )}
          </Field.Root>

          <Button type="submit" size="lg" loading={isLoading}>
            Criar conta
          </Button>
        </form>
      </Stack>

      <Text textAlign="center" color="fg.muted">
        Já tem uma conta?{' '}
        <Link asChild>
          <NextLink href="/account/login">Entrar</NextLink>
        </Link>
      </Text>
    </Stack>
  );
}
