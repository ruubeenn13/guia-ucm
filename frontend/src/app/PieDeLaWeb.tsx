/**
 * Pie de la web.
 *
 * Los avisos de aquí no son adorno: la guía es un proyecto de fans y tanto
 * Marvel como TMDB exigen que quede dicho. Los enlaces legales se añaden en
 * el hito 2, junto con las cuentas.
 */
export function PieDeLaWeb() {
  return (
    <footer className="mt-20 border-t border-[var(--c-borde)] bg-[var(--c-superficie)]">
      <div className="contenedor-guia flex flex-col gap-4 py-10 text-sm text-[var(--c-texto-suave)]">
        <p className="titular text-2xl text-[var(--c-texto)]">Guía UCM</p>

        <p>Guía de fans, no oficial. No afiliada a Marvel Studios ni a The Walt Disney Company.</p>

        <p lang="en">This product uses the TMDB API but is not endorsed or certified by TMDB.</p>

        <p className="text-[var(--c-texto-tenue)]">
          Guía de fans · No oficial · Carátulas y sinopsis: TMDB
        </p>
      </div>
    </footer>
  );
}
