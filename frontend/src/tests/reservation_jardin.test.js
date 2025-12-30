// Tests unitaires pour la logique de réservation de créneaux
import { describe, it, expect } from '@jest/globals';

// Fonction utilitaire pour tester la sélection/déselection des créneaux
function handleSlotChange(selectedSlots, slotId) {
  return selectedSlots.includes(slotId)
    ? selectedSlots.filter((id) => id !== slotId)
    : [...selectedSlots, slotId];
}

describe('handleSlotChange', () => {
  it('ajoute un créneau si non sélectionné', () => {
    expect(handleSlotChange([1, 2], 3)).toEqual([1, 2, 3]);
  });

  it('retire un créneau si déjà sélectionné', () => {
    expect(handleSlotChange([1, 2, 3], 2)).toEqual([1, 3]);
  });
});

