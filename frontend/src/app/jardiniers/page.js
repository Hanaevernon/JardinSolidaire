import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import ListeJardiniers from "./index";

export default function Jardiniers() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-16">
        
        <ListeJardiniers/>
      </main>
      <Footer />
    </div>
  );
}
