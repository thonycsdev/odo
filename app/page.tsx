const features = [
  {
    title: 'Registre cada repetição',
    description:
      'Barra fixa, abdominal, flexão — anote seus treinos em segundos e acompanhe sua evolução ao longo do tempo.',
  },
  {
    title: 'Dispute com outros atletas',
    description:
      'Veja como você se compara com a comunidade. Rankings por exercício, por período e por faixa.',
  },
  {
    title: 'Suba de faixa e Dan',
    description:
      'Cada conquista te aproxima da próxima faixa. Do Branco ao Preto 9° Dan — a jornada é sua.',
  },
];

const belts = [
  { label: 'Branco', dan: null, color: 'bg-belt-white', text: 'text-black' },
  { label: 'Amarelo', dan: null, color: 'bg-belt-yellow', text: 'text-black' },
  {
    label: 'Laranja',
    dan: null,
    color: 'bg-belt-orange',
    text: 'text-white',
  },
  { label: 'Verde', dan: null, color: 'bg-belt-green', text: 'text-white' },
  { label: 'Azul', dan: null, color: 'bg-belt-blue', text: 'text-white' },
  { label: 'Vermelho', dan: null, color: 'bg-belt-red', text: 'text-white' },
  {
    label: 'Preto',
    dan: '1° – 9° Dan',
    color: 'bg-belt-black border border-white/30',
    text: 'text-white',
  },
];

export default function Home(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 border-b border-white/10 backdrop-blur-sm bg-black/80">
        <span className="text-xl font-bold tracking-tight bg-linear-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">
          odo
        </span>
        <div className="flex items-center gap-4">
          <a
            href="/login"
            className="text-sm text-white/70 hover:text-white transition-colors"
          >
            Entrar
          </a>
          <a
            href="/register"
            className="text-sm px-4 py-2 rounded-full bg-linear-to-r from-brand-600 to-brand-800 hover:from-brand-500 hover:to-brand-700 transition-all"
          >
            Começar agora
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-6 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-black via-brand-950/30 to-black" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full bg-brand-700/20 blur-[120px]" />

        <div className="relative z-10 flex flex-col items-center gap-6 max-w-3xl">
          <span className="text-xs font-semibold tracking-widest uppercase text-brand-400 border border-brand-800 px-3 py-1 rounded-full">
            Seu treino virou um jogo
          </span>
          <h1 className="text-5xl sm:text-7xl font-bold leading-tight tracking-tight">
            Treine.{' '}
            <span className="bg-linear-to-r from-brand-400 via-brand-300 to-brand-500 bg-clip-text text-transparent">
              Evolua.
            </span>{' '}
            Domine.
          </h1>
          <p className="text-lg text-white/60 max-w-xl leading-relaxed">
            Registre suas barras e abdominais, compare com outros atletas e
            suba de faixa como no Taekwondo — do Branco ao Preto 9° Dan.
          </p>
          <div className="flex items-center gap-4 mt-2">
            <a
              href="/register"
              className="px-6 py-3 rounded-full bg-linear-to-r from-brand-600 to-brand-800 font-semibold hover:from-brand-500 hover:to-brand-700 transition-all shadow-lg shadow-brand-900/40"
            >
              Criar conta grátis
            </a>
            <a
              href="#faixas"
              className="px-6 py-3 rounded-full border border-white/20 text-white/80 font-semibold hover:border-brand-500 hover:text-white transition-all"
            >
              Ver faixas
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-32 px-6">
        <div className="absolute inset-0 bg-linear-to-b from-black via-brand-950/10 to-black" />
        <div className="relative z-10 max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            Como funciona
          </h2>
          <p className="text-center text-white/50 mb-16 max-w-lg mx-auto">
            Simples de usar. Difícil de parar.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-brand-700/60 hover:bg-brand-950/20 transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-brand-500 to-brand-900 mb-4" />
                <h3 className="font-semibold text-lg mb-2 group-hover:text-brand-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Belts */}
      <section id="faixas" className="relative py-32 px-6">
        <div className="absolute inset-0 bg-linear-to-b from-black via-brand-950/15 to-black" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Sistema de Faixas e Dans
          </h2>
          <p className="text-white/50 mb-16 max-w-lg mx-auto">
            Cada exercício concluído te aproxima da próxima faixa. A progressão
            é inspirada no Taekwondo — disciplina e consistência acima de tudo.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {belts.map((belt) => (
              <div key={belt.label} className="flex flex-col items-center gap-2">
                <div
                  className={`w-14 h-4 rounded-full ${belt.color} shadow-lg`}
                />
                <span className="text-xs font-medium text-white/70">
                  {belt.label}
                </span>
                {belt.dan && (
                  <span className="text-[10px] text-brand-400">{belt.dan}</span>
                )}
              </div>
            ))}
          </div>
          <div className="mt-12 flex items-center justify-center gap-3 text-white/30 text-sm">
            <div className="h-px w-16 bg-white/10" />
            <span>Cada faixa exige mais repetições, mais consistência</span>
            <div className="h-px w-16 bg-white/10" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto rounded-3xl p-px bg-linear-to-br from-brand-600 via-brand-900 to-black">
          <div className="rounded-3xl bg-linear-to-br from-brand-950/80 to-black p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Pronto para começar sua jornada?
            </h2>
            <p className="text-white/60 mb-8">
              Junte-se a atletas que estão transformando treino em conquista.
            </p>
            <a
              href="/register"
              className="inline-block px-8 py-3 rounded-full bg-linear-to-r from-brand-500 to-brand-700 font-semibold hover:from-brand-400 hover:to-brand-600 transition-all shadow-lg shadow-brand-900/50"
            >
              Criar minha conta
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-8 flex items-center justify-between text-sm text-white/40">
        <span className="font-semibold bg-linear-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">
          odo
        </span>
        <span>
          &copy; {new Date().getFullYear()} odo. Todos os direitos reservados.
        </span>
      </footer>
    </div>
  );
}
