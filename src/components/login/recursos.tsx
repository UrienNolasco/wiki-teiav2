import { CloudUpload,Eye, School } from "lucide-react";
import Image from "next/image";

const Recursos = () => {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-start p-8 bg-gradient-to-b text-black bg-[#fffbf3]">
      <h2
        className="w-full text-center text-6xl font-bold mt-5 uppercase"
        style={{ fontFamily: "Red Hat Display" }}
      >
        Recursos
      </h2>
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-around gap-8 flex-grow mb-5">
        <div className="flex flex-col items-center">
          <School size={64} className="text-red-500" />
          <span className="mt-4 text-2xl font-medium">VIDEOAULAS</span>
        </div>
        <div className="flex flex-col items-center">
          <Eye size={64} className="text-blue-500" />
          <span className="mt-4 text-2xl font-medium">APRESENTAÇÕES</span>
        </div>
        <div className="flex flex-col items-center">
          <CloudUpload size={64} className="text-pink-500" />
          <span className="mt-4 text-2xl font-medium">FEEDBACKS</span>
        </div>
      </div>
      {/* Imagem fixa no bottom da section */}
      <div className="absolute bottom-0 left-0 w-full">
        <Image
          src={"/TopoPagina1.svg"}
          alt="Ondas"
          width={15000}
          height={100}
          style={{ marginBottom: "-25px" }}
        />
      </div>
    </section>
  );
};

export default Recursos;
