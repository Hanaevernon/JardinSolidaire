import '@testing-library/jest-dom';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    login: jest.fn(),
  }),
}));

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Inscription from '../app/inscription/page.js';

describe('Formulaire d’inscription', () => {
  beforeEach(() => {
    window.alert = jest.fn();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: "Mot de passe invalide" }),
      })
    );
  });

  it('affiche une erreur si le mot de passe ne respecte pas les critères', async () => {
    render(<Inscription />);

    // ⚠️ Supprime les contraintes HTML pour permettre la soumission
    screen.getByPlaceholderText('Mot de passe').removeAttribute('pattern');
    screen.getByPlaceholderText('Mot de passe').removeAttribute('minLength');

    fireEvent.change(screen.getByPlaceholderText('Votre prénom'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByPlaceholderText('Votre nom'), { target: { value: 'User' } });
    fireEvent.change(screen.getByPlaceholderText('Votre adresse e-mail'), { target: { value: 'test@mail.com' } });
    fireEvent.change(screen.getByPlaceholderText('Mot de passe'), { target: { value: 'abcabc' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'ami_du_vert' } });

    fireEvent.click(screen.getByRole('button', { name: /inscrire/i }));

    await waitFor(() => {
      expect(screen.getByText(/mot de passe invalide/i)).toBeInTheDocument();
    });
  });
});
