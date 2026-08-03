import fs from "fs";

const p = "src/components/AlimentacionPage.tsx";
const s = fs.readFileSync(p, "utf8");
const start = s.indexOf('      <div className="mx-auto max-w-6xl space-y-14');
const endMarker = "\n    </div>\n  );\n}";
const end = s.indexOf(endMarker, start);
if (start < 0 || end < 0) {
  console.error("markers", start, end);
  process.exit(1);
}

const next = `      <div className="mx-auto max-w-6xl space-y-16 px-4 pt-8 md:space-y-24 md:px-8 md:pt-12">
        <WeekNav />

        <section id="videos" className="scroll-mt-28">
          <SectionTitle
            title="Para abrir el apetito"
            subtitle="Míralos cuando quieras. Son la base antes de entrar semana a semana."
          />
          <VideoCards />
        </section>

        <WeekShell
          id="semana-0"
          eyebrow="Semana 0"
          title="Tu canasta"
          subtitle="Arma el mercado con calma. Aquí va lo esencial; en Drive está el pack para imprimir."
          driveHref={data.driveFolders.week0 || undefined}
          driveLabel="Descargar lista en Drive"
        >
          <div className="mb-8 grid items-end gap-8 md:grid-cols-[0.9fr_1.1fr]">
            <motion.div
              className="relative mx-auto w-full max-w-[260px] md:mx-0"
              initial={{ opacity: 0, y: 24, rotate: 8 }}
              whileInView={{ opacity: 1, y: 0, rotate: 3.5 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ rotate: 1, scale: 1.02 }}
            >
              <div className="overflow-hidden rounded-[1.5rem] bg-white p-2.5 shadow-[0_18px_44px_rgba(85,104,148,0.18)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={data.marketImage}
                  alt=""
                  className="aspect-[3/4] w-full rounded-[1.15rem] object-cover"
                />
              </div>
            </motion.div>
            <p className="max-w-md font-script text-2xl text-gals-blue-deep md:text-3xl">
              Empezar por la despensa también es cuidarte
            </p>
          </div>
          <MarketList />
        </WeekShell>

        <WeekShell
          id="semana-1"
          eyebrow="Semana 1"
          title="Volver a ti"
          subtitle="Práctica suave, mapa de intenciones y el marco de la guía. Lo largo se descarga en Drive."
          driveHref={data.driveFolders.week1 || undefined}
          driveLabel="Material semana 1 en Drive"
        >
          <div className="space-y-10">
            <WeeklyActions week={1} />
            <div>
              <SectionTitle
                title={data.intentions.title}
                subtitle={data.intentions.subtitle}
              />
              <IntentionsMap />
            </div>
            {data.longGuides.map((g) => (
              <article
                key={g.id}
                className="rounded-2xl bg-gradient-to-br from-gals-blue to-gals-blue-deep p-6 text-white shadow-[0_8px_30px_rgba(85,104,148,0.25)] md:p-8"
              >
                <p className="text-xs font-semibold tracking-[0.16em] text-white/75 uppercase">
                  {g.eyebrow}
                </p>
                <h3 className="mt-2 font-display text-2xl uppercase md:text-3xl">
                  {g.title}
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/90 md:text-base">
                  {g.summary}
                </p>
                <ul className="mt-5 space-y-2">
                  {g.bullets.map((b) => (
                    <li key={b} className="flex gap-2 text-sm text-white/95">
                      <span aria-hidden>→</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </WeekShell>

        <WeekShell
          id="semana-2"
          eyebrow="Semana 2"
          title="En el supermercado"
          subtitle="Qué conviene dejar, cómo leer etiquetas y la práctica de la semana. Los tarjeteros imprimibles van en Drive."
          driveHref={data.driveFolders.week2 || undefined}
          driveLabel="Material semana 2 en Drive"
        >
          <div className="space-y-10">
            <WeeklyActions week={2} />
            <div>
              <SectionTitle
                title={data.avoidGuide.title}
                subtitle={data.avoidGuide.subtitle}
              />
              <GuideGroups groups={data.avoidGuide.groups} />
            </div>
            <div>
              <SectionTitle
                title={data.labelGuide.title}
                subtitle={data.labelGuide.subtitle}
              />
              <GuideGroups groups={data.labelGuide.groups} />
            </div>
          </div>
        </WeekShell>

        <section id="semana-3" className="scroll-mt-28">
          <SectionTitle
            eyebrow="Semana 3"
            title="Cuando la comida también es emoción"
            subtitle="Esta semana vive aquí: no hay carpeta de Drive. Solo escucha, a tu ritmo."
          />
          <AudioCards />
        </section>

        <WeekShell
          id="semana-4"
          eyebrow="Semana 4"
          title="Reintroducción"
          subtitle="Reglas suaves y tu diario. La guía completa de reintroducción está en Drive."
          driveHref={data.driveFolders.week4 || undefined}
          driveLabel="Guía de reintroducción en Drive"
        >
          <RecommendationsBlock />
        </WeekShell>

        <section className="rounded-2xl border border-[#e6e8ee] bg-white p-6 text-center md:p-8">
          <p className="font-display text-2xl tracking-tight text-gals-ink uppercase">
            Si quieres vivirlo en persona
          </p>
          <p className="mx-auto mt-2 max-w-lg text-sm text-gals-muted">
            En el studio el movimiento y esta forma de comer se encuentran.
            Cuando te sientas lista, estamos.
          </p>
          <a
            href={data.ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex rounded-full bg-gals-blue-deep px-6 py-3 text-sm font-semibold text-white"
          >
            {data.ctaLabel}
          </a>
        </section>
      </div>`;

fs.writeFileSync(p, s.slice(0, start) + next + s.slice(end));
console.log("rewrote content block");
