"use client";

import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full bg-green-600 text-white mt-8">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between">
        {/* Texte copyright */}
        <p className="text-sm text-center md:text-left">
          © {new Date().getFullYear()} JardinSolidaire. Tous droits réservés.
        </p>

        {/* Liens */}
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
          <Link href="/help" className="hover:underline">
            Centre d&apos;aide
          </Link>
          <Link href="/mentions-legales" className="hover:underline">
            Mentions légales
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
