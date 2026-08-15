import { expect, test } from '@playwright/test';

/**
 * Flujo feliz del hito 1: entrar, marcar un título como visto y comprobar
 * que el progreso se guarda y sobrevive a recargar la página.
 *
 * Cuando existan las cuentas (hito 2) este mismo recorrido se extiende con
 * registrarse, verificar el código y ver el progreso ya sincronizado.
 */
test.describe('Guía UCM · flujo de invitado', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Cada prueba empieza sin progreso previo.
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('la portada carga con la guía entera', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText('El universo');

    // 67 títulos marcables, tal y como los sirve la API.
    await expect(page.getByText('Orden cronológico · 67 títulos')).toBeVisible();

    // Los 12 bloques temáticos.
    await expect(page.getByRole('heading', { name: 'Los orígenes' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Rumbo a Secret Wars' })).toBeVisible();
  });

  test('marcar un título actualiza el progreso y sobrevive a recargar', async ({ page }) => {
    const marcar = page
      .getByRole('button', { name: 'Marcar «Capitán América: El Primer Vengador» como vista' })
      .last();

    await marcar.click();

    // El botón pasa a «Vista» y el contador sube a 1/67.
    await expect(
      page
        .getByRole('button', { name: 'Quitar «Capitán América: El Primer Vengador» de vistas' })
        .last(),
    ).toBeVisible();
    await expect(page.getByText('1/67', { exact: false }).first()).toBeVisible();

    await page.reload();
    await expect(page.getByText('1/67', { exact: false }).first()).toBeVisible();
  });

  test('el buscador ignora las tildes', async ({ page }) => {
    await page.getByRole('searchbox', { name: 'Buscar un título' }).fill('capitan america');

    await expect(page.getByRole('heading', { name: 'Capitán América: Civil War' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Iron Man', exact: true })).toBeHidden();
  });

  test('el conmutador de orden cambia la lista al orden de estreno', async ({ page }) => {
    await page.getByRole('button', { name: 'Estreno' }).click();

    // En orden de estreno desaparecen los encabezados de bloque.
    await expect(page.getByRole('heading', { name: 'Los orígenes' })).toBeHidden();
  });

  test('el tema se conmuta y se recuerda', async ({ page }) => {
    await page.getByRole('button', { name: /Cambiar a tema/ }).click();
    const tema = await page.evaluate(() => document.documentElement.dataset['tema']);

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-tema', tema ?? 'oscuro');
  });

  test('los títulos sin estrenar no se pueden marcar', async ({ page }) => {
    await page.getByRole('searchbox', { name: 'Buscar un título' }).fill('Doomsday');

    await expect(page.getByText('Aún sin estrenar').first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Doomsday.*como vista/ })).toHaveCount(0);
  });
});
