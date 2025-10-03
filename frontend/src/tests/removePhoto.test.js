import { removePhotoFromArray } from '../utils/removePhoto';

describe('removePhotoFromArray', () => {
  test('supprime l’élément à l’index indiqué', () => {
    const photos = ['img1.png', 'img2.png', 'img3.png'];
    const result = removePhotoFromArray(photos, 1);
    expect(result).toEqual(['img1.png', 'img3.png']);
  });

  test('ne modifie pas si index négatif', () => {
    const photos = ['a.jpg', 'b.jpg'];
    const result = removePhotoFromArray(photos, -1);
    expect(result).toBe(photos);
  });

  test('ne modifie pas si index >= length', () => {
    const photos = ['a.jpg', 'b.jpg'];
    const result = removePhotoFromArray(photos, 2);
    expect(result).toBe(photos);
  });

  test('fonctionne sur un tableau vide', () => {
    expect(removePhotoFromArray([], 0)).toEqual([]);
  });
});
