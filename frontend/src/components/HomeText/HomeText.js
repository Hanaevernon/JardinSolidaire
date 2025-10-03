"use client";

const HomeText = () => {
  return (
    <section className="max-w-4xl mx-auto my-12 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-4 text-center text-green-700">
        🌱 Bienvenue sur JardinSolidaire
      </h2>
      <p className="text-gray-700 leading-relaxed text-justify">
        JardinSolidaire est une plateforme qui connecte les propriétaires de
        jardins et les passionnés de nature. Les propriétaires publient leurs
        annonces pour recevoir de l’aide, tandis que les « amis du vert »
        proposent leurs compétences pour entretenir et profiter de la nature.{" "}
        <br /> Ensemble, créons des liens humains autour du jardinage 🌿.
      </p>
    </section>
  );
};

export default HomeText;
