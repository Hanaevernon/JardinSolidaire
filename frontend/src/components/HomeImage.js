"use client";

import Image from "next/image";

const HomeImage = () => {
  return (
    <div className="relative w-full h-80 md:h-96 lg:h-[500px]">
      <Image
        src="/assets/garden.jpg" 
        alt="Image de fond"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex space-x-6">
          <button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded">
            Nos jardins
          </button>
          <button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded">
            Nos Jardiniers
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeImage;
