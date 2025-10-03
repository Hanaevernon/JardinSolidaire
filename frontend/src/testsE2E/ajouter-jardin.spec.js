import { test, expect } from '@playwright/test';
import path from 'path';


test.describe('Page Ajouter un Jardin', () => {
  // Chemin vers un dossier fixtures contenant au moins 6 images de test
  const fixturesDir = path.resolve(__dirname, 'fixtures');
  const files = [
      path.join(fixturesDir, 'jardin 1.jpg'),
      path.join(fixturesDir, 'jardin 2.jpg'),
      path.join(fixturesDir, 'jardin 3.jpg'),
      path.join(fixturesDir, 'jardin 4.jpg'),
      path.join(fixturesDir, 'jardin 5.jpg'),
      path.join(fixturesDir, 'jardin 6.jpg'),
  ];

  test.beforeEach(async ({ page }) => {
    // navigue sur la page 
    await page.goto('/ajouter-jardin');
  });

  test('bloque l’ajout au-dessus de 5 photos et affiche une alerte', async ({ page }) => {
    // Prépare la gestion de la boîte de dialogue alert()
    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    const fileInput = page.locator('input[type="file"]');
    // Tente d’uploader 6 fichiers en une seule fois
    await fileInput.setInputFiles(files);

    // On attend que l’alerte ait été capturée
    expect(alertMessage).toBe('Tu ne peux ajouter que 5 photos maximum.');

    // comme l’ajout est annulé, il n’y a aucune photo
    await expect(page.locator('img[alt^="Photo"]')).toHaveCount(0);
  });
  test('ajoute correctement jusqu’à 5 photos sans alerte', async ({ page }) => {
    // 7) On prépare un flag pour vérifier qu’aucune alerte ne s’affiche
    let alerted = false;
    page.on('dialog', () => { alerted = true; });

    // 8) On n’uploade que 5 fichiers
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(files.slice(0, 5));

    // 9) Pas d’alerte doit avoir été déclenchée
    expect(alerted).toBe(false);

    // 10) Et on doit voir exactement 5 vignettes dans la page
    await expect(page.locator('img[alt^="Photo"]')).toHaveCount(5);
  });

  test('permet de supprimer une photo via le bouton ✖', async ({ page }) => {
    // 11) On upload 3 photos
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(files.slice(0, 3));
    const thumbs = page.locator('img[alt^="Photo"]');
    await expect(thumbs).toHaveCount(3);

    // 12) On clique sur la croix de la deuxième vignette (index 1)
    const removeButtons = page.locator('button:has-text("✖")');
    await removeButtons.nth(1).click();

    // 13) Il ne doit rester que 2 photos visibles
    await expect(thumbs).toHaveCount(2);

    // 14) On s’assure qu’aucune alerte ne s’est déclenchée à ce moment
    page.on('dialog', () => { throw new Error('Aucune alerte attendue'); });
  });


  test('upload de photos, soumission, alert & redirection', async ({ page }) => {
    await page.route('http://localhost:5001/api/jardins', async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' });
    });

    let alertMessage = '';
    page.on('dialog', async d => { alertMessage = d.message(); await d.accept(); });

    // uploade deux photos
    await page.locator('input[type="file"]').setInputFiles(files.slice(0, 2));
    // remplit les champs
    await page.fill('input[name="nom"]', 'Mon joli jardin');
    await page.fill('textarea[name="description"]', 'Description test');
    await page.fill('input[name="adresse"]', 'Paris 11e');
    await page.fill('input[name="surface"]', '50');
    await page.fill('input[name="type"]', 'arrosage');
    // soumission et attente de redirection
    await Promise.all([
      page.waitForURL('**/jardins'),
      page.click('button:has-text("Ajouter mon jardin")'),
    ]);

    expect(alertMessage).toBe('Jardin ajouté !');
    expect(page.url()).toContain('/jardins');
  });

});