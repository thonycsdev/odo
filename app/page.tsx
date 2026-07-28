'use client'
import {
  Header,
  LinkButton,
  PageLayout,
  Stack,
  Text,
} from '@primer/react';
import { Blankslate, Card } from '@primer/react/experimental';

const features = [
  {
    title: 'Registre seus gastos',
    description:
      'Anote cada despesa em segundos e tenha uma visão clara de para onde vai o seu dinheiro.',
  },
  {
    title: 'Defina metas de economia',
    description:
      'Estabeleça quanto quer guardar por mês e acompanhe o quanto falta para alcançar cada meta.',
  },
  {
    title: 'Acompanhe sua evolução',
    description:
      'Veja relatórios que mostram seu progresso rumo à liberdade financeira.',
  },
];


export default function Home(): React.JSX.Element {
  return (
    <PageLayout containerWidth="full">
      <PageLayout.Header>
        <Header>
          <Header.Item>
            <Header.Link href="/">odo</Header.Link>
          </Header.Item>
          <Header.Item full />
          <Header.Item>
            <LinkButton href="/account/login" color='white' size='small'>
              Entrar
            </LinkButton>
          </Header.Item>
          <Header.Item>
            <LinkButton href="/account/login" variant="primary" size="small">
              Criar conta grátis
            </LinkButton>
          </Header.Item>
        </Header>
      </PageLayout.Header>

      <PageLayout.Content>
        <Blankslate spacious>
          <Blankslate.Heading as="h1">
            Economize. Cresça. Conquiste.
          </Blankslate.Heading>
          <Blankslate.Description>
            Registre seus gastos, defina metas de economia e acompanhe sua
            evolução financeira até a liberdade financeira.
          </Blankslate.Description>
          <Blankslate.PrimaryAction href="/account/login">
            Criar conta grátis
          </Blankslate.PrimaryAction>
          <Blankslate.SecondaryAction href="#recursos">
            Ver como funciona
          </Blankslate.SecondaryAction>
        </Blankslate>

        <Stack direction="vertical" align="center" padding="spacious">

        </Stack>
      </PageLayout.Content>

      <PageLayout.Footer divider="line">
        <Stack direction="horizontal" justify="space-between" align="center">
          <Text size="small">
            &copy; {new Date().getFullYear()} odo. Todos os direitos reservados.
          </Text>
        </Stack>
      </PageLayout.Footer>
    </PageLayout>
  );
}
