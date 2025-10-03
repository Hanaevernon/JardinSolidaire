const { test, expect } = require('@playwright/test');

test.describe('Page “Je veux jardiner”', () => {
  const path = '/je-veux-jardiner';

  test.beforeEach(async ({ page }) => {
    await page.goto(path);
  });

  test('doit afficher le titre et tous les champs du formulaire', async ({ page }) => {
    // 1) titre <h1>
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    await expect(h1).toHaveText('Je veux jardiner');

    // 2) vérifier que le <form> existe
    await expect(page.locator('form')).toHaveCount(1);

    // 3) les labels attendus (au moins une occurrence visible)
    // on vérifie simplement qu’il y a au moins une étiquette 'Prénom'
    const labelPrenom = page.locator('label:has-text("Prénom")');
    await expect(labelPrenom).toHaveCountGreaterThan(0);

    const labelNom = page.locator('label:has-text("Nom")');
    await expect(labelNom).toHaveCountGreaterThan(0);

    const labelLocalisation = page.locator('label:has-text("Localisation")');
    await expect(labelLocalisation).toHaveCountGreaterThan(0);

    const labelDescription = page.locator('label:has-text("Description")');
    await expect(labelDescription).toHaveCountGreaterThan(0);

    const labelCompetence = page.locator('label:has-text("Compétence")');
    await expect(labelCompetence).toHaveCountGreaterThan(0);

    const labelAnnees = page.locator('label:has-text("Année")');
    await expect(labelAnnees).toHaveCountGreaterThan(0);

    // 4) les inputs correspondants

    // input[name="nom"] → 2 occurrences (Prénom + Nom)
    const inputsNom = page.locator('input[name="nom"]');
    await expect(inputsNom).toHaveCount(2);

    // input[name="localisation"]
    await expect(page.locator('input[name="localisation"]')).toHaveCountGreaterThan(0);

    // textarea[name="description"]
    await expect(page.locator('textarea[name="description"]')).toHaveCountGreaterThan(0);

    // input[name="services"] → 2 occurrences (compétence + années d’expériences)
    const inputsServices = page.locator('input[name="services"]');
    await expect(inputsServices).toHaveCount(2);

    // input[type="file"][multiple][accept="image/*"]
    const fileInput = page.locator('input[type="file"][multiple][accept="image/*"]');
    await expect(fileInput).toHaveCountGreaterThan(0);
  });

  test("ne doit pas laisser soumettre si un champ requis est vide", async ({ page }) => {
    let alertCalled = false;
    let consoleLogs = [];

    // intercepter les alertes
    page.on('dialog', dialog => {
      if (dialog.type() === 'alert') {
        alertCalled = true;
        dialog.dismiss().catch(() => {});
      }
    });
    // intercepter les console.log()
    page.on('console', msg => {
      if (msg.type() === 'log') consoleLogs.push(msg.text());
    });

    // on remplit uniquement le premier champ "nom"
    await page.locator('input[name="nom"]').first().fill('Alice');
    // description vide (champ requis)

    // on clique sur le bouton de soumission
    await page.locator('button[type="submit"]').click();

    // 1) vérifier qu’aucune alert() n’a été affichée
    expect(alertCalled).toBe(false);

    // 2) vérifier qu’aucun console.log() n’a été déclenché
    expect(consoleLogs.length).toBe(0);

    // 3) vérifier qu’au moins un champ HTML est invalidé
    const invalidCount = await page.locator('input:invalid, textarea:invalid').count();
    expect(invalidCount).toBeGreaterThan(0);
  });
});

// extension personnalisée pour Playwright pour vérifier “>= 1”
// (à ajouter en haut du fichier ou dans un helper global)
expect.extend({
  async toHaveCountGreaterThan(locator, expected) {
    const count = await locator.count();
    const pass = count > expected;
    return {
      pass,
      message: () =>
        `expected locator to have count > ${expected}, but got ${count}`,
    };
  },
});
