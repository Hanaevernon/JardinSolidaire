import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Inscription from '../app/inscription/page.js';

describe('Formulaire d’inscription', () => {
  beforeEach(() => {
    window.alert = jest.fn();
  });

  it('affiche une alerte si le mot de passe ne respecte pas les critères', async () => {
    render(<Inscription />);

    // ⚠️ Supprime les contraintes HTML pour permettre la soumission
    screen.getByPlaceholderText('Votre mot de passe').removeAttribute('pattern');
    screen.getByPlaceholderText('Votre mot de passe').removeAttribute('minLength');

    fireEvent.change(screen.getByPlaceholderText('Votre prénom'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByPlaceholderText('Votre nom'), { target: { value: 'User' } });
    fireEvent.change(screen.getByPlaceholderText('Votre adresse e-mail'), { target: { value: 'test@mail.com' } });
    fireEvent.change(screen.getByPlaceholderText('Votre mot de passe'), { target: { value: 'abcabc' } });
    fireEvent.change(screen.getByPlaceholderText('Confirmez votre mot de passe'), { target: { value: 'abcabc' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'ami_du_vert' } });

    fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

    await waitFor(() => {
      console.log('Alert called:', window.alert.mock.calls); // 🐞 debug
      expect(window.alert).toHaveBeenCalled();
    });
  });
});
