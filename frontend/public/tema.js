/*
 * Aplica el tema guardado antes de que se pinte nada, para que quien entra
 * con el tema oscuro no reciba un fogonazo blanco.
 *
 * Va en un archivo aparte y no como script en línea para poder mantener una
 * CSP estricta con `script-src 'self'`, sin nonces ni hashes que mantener.
 */
(function () {
  try {
    var guardado = localStorage.getItem('guia-ucm:tema');
    var prefiereOscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var tema =
      guardado === 'claro' || guardado === 'oscuro'
        ? guardado
        : prefiereOscuro
          ? 'oscuro'
          : 'claro';

    document.documentElement.dataset.tema = tema;
    document.documentElement.style.colorScheme = tema === 'oscuro' ? 'dark' : 'light';

    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = tema === 'oscuro' ? '#0b0a0f' : '#f6f4f1';
  } catch (error) {
    /* Sin localStorage nos quedamos con el tema claro del HTML. */
  }
})();
