// Tests unitaires pour la logique d'ajout de jardin
import { describe, it, expect } from '@jest/globals';

// Simule la logique de handleChange
function handleChange(prev, name, value) {
  return { ...prev, [name]: value };
}

describe('handleChange', () => {
  it('met à jour le champ du formulaire', () => {
    const prev = { titre: '', description: '' };
    expect(handleChange(prev, 'titre', 'Mon jardin')).toEqual({ titre: 'Mon jardin', description: '' });
  });
});

// Simule la logique de handleFileChange
function handleFileChange(prevPhotos, newFiles) {
  if (prevPhotos.length + newFiles.length > 5) {
    return prevPhotos; // Limite à 5
  }
  return [...prevPhotos, ...newFiles];
}

describe('handleFileChange', () => {
  it('ajoute des photos si moins de 5', () => {
    const prev = [1, 2];
    const files = [3, 4];
    expect(handleFileChange(prev, files)).toEqual([1, 2, 3, 4]);
  });

  it('n’ajoute pas si dépasse 5', () => {
    const prev = [1, 2, 3, 4];
    const files = [5, 6];
    expect(handleFileChange(prev, files)).toEqual([1, 2, 3, 4]);
  });
});

// Simule la logique de removePhoto
function removePhoto(prevPhotos, index) {
  return prevPhotos.filter((_, i) => i !== index);
}

describe('removePhoto', () => {
  it('retire la photo à l’index donné', () => {
    expect(removePhoto(['a', 'b', 'c'], 1)).toEqual(['a', 'c']);
  });

  it('retourne le tableau inchangé si index hors limite', () => {
    expect(removePhoto(['a', 'b'], 5)).toEqual(['a', 'b']);
  });
});
