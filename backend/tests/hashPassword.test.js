const { hashPassword } = require('../utils');

describe('Hashage de mot de passe', () => {
  it('doit hasher un mot de passe et le vérifier correctement', async () => {
    const password = 'Test123!';
    const hashedPassword = await hashPassword(password);
    expect(hashedPassword).toBeDefined(); // vérifie qu’il y a bien un résultat
    expect(hashedPassword).not.toBe(password); // vérifie que ce n’est pas le mot de passe en clair
  });
});
