'use client';
import React, { useState } from 'react';
import Footer from '../../components/Footer/Footer';
import Navbar from '../../components/Navbar/Navbar';
import { useEffect } from 'react';

export default function ModifierMotDePasse() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const isValid = hasMinLength && hasUppercase && hasNumber && hasSpecialChar;

  const [email, setEmail] = useState('');

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("🚫 Les deux mots de passe ne correspondent pas. Veuillez réessayer.");
      return;
    }

    if (!isValid) {
      setMessage("🔐 Votre mot de passe doit respecter les conditions ci-dessous.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/modifier_mdp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, nouveauMotDePasse: password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("🎉 Votre mot de passe a bien été mis à jour. Vous allez être redirigé...");
        const role = data.user.role;

        if (role === 'ami_du_vert') {
          window.location.href = '/accueil';
        } else if (role === 'proprietaire') {
          window.location.href = '/jardiniers';
        } else {
          window.location.href = '/jardins';
        }
      } else {
        setMessage(data.error || "🌧️ Une erreur est survenue. Merci de réessayer plus tard.");
      }
    } catch (error) {
      console.error(error);
      setMessage("🌧️ Une erreur est survenue. Merci de réessayer plus tard.");
    }
  };

  const styles = {
    container: {
      maxWidth: '500px',
      margin: '0 auto',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    title: {
      textAlign: 'center',
      color: '#021904',
      marginBottom: '20px',
      fontSize: '28px',
    },
    intro: {
      textAlign: 'center',
      color: '#4e784f',
      fontSize: '18px',
      marginBottom: '30px',
      lineHeight: '1.5',
    },
    passwordWrapper: {
      position: 'relative',
      marginBottom: '20px',
    },
    passwordInput: {
      width: '100%',
      padding: '14px',
      paddingRight: '50px',
      border: '2px solid #6ec173',
      borderRadius: '10px',
      fontSize: '18px',
      color: '#021904',
    },
    toggleButton: {
      position: 'absolute',
      top: '50%',
      right: '12px',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#6ec173',
      fontSize: '14px',
    },
    button: {
      padding: '14px',
      backgroundColor: '#6ec173',
      color: '#fff',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '18px',
      marginTop: '10px',
    },
    passwordHint: (valid) => ({
      color: valid ? '#4e784f' : '#e3107d',
      fontSize: '14px',
      marginBottom: '5px',
    }),
    error: {
      color: '#e3107d',
      textAlign: 'center',
      marginTop: '15px',
    },
    success: {
      color: '#4e784f',
      textAlign: 'center',
      marginTop: '15px',
    },
  };

  return (
    <>
      <Navbar />
      <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', paddingTop: '100px' }}>
        <div style={styles.container}>
          <h2 style={styles.title}>Modifier votre mot de passe</h2>
          <p style={styles.intro}>
            🌱 Prenez soin de votre jardin en protégeant votre compte avec un mot de passe solide.
          </p>

          <form onSubmit={handleSubmit}>
            {/* Nouveau mot de passe */}
            <div style={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nouveau mot de passe"
                required
                style={styles.passwordInput}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.toggleButton}
              >
                {showPassword ? 'Masquer' : 'Afficher'}
              </button>
            </div>

            {/* Confirmation */}
            <div style={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmer le mot de passe"
                required
                style={styles.passwordInput}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.toggleButton}
              >
                {showPassword ? 'Masquer' : 'Afficher'}
              </button>
            </div>

            {/* Conditions */}
            <p style={styles.passwordHint(hasMinLength)}>✔️ 8 caractères minimum</p>
            <p style={styles.passwordHint(hasUppercase)}>✔️ Une majuscule</p>
            <p style={styles.passwordHint(hasNumber)}>✔️ Un chiffre</p>
            <p style={styles.passwordHint(hasSpecialChar)}>✔️ Un caractère spécial</p>

            <button type="submit" style={styles.button}>
              Valider le nouveau mot de passe
            </button>

            {message && (
              <p style={message.startsWith("🎉") ? styles.success : styles.error}>
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
