import HomeImage from "../components/HomeImage/HomeImage";
import HomeText from "../components/HomeText/HomeText";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center gap-10 py-16">
      <HomeImage />
      <HomeText />
    </main>
  );
}
