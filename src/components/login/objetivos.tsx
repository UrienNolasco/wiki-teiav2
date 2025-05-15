import Image from "next/image";

const Objetivos = () => {
  return (
    <section className="relative w-full h-screen flex items-center bg-[#fffbf3] text-black p-8">
      {/* Imagem fixa no top da section */}
      <div
        className="absolute top-0 left-0 w-full"
        style={{ marginTop: "-25px" }}
      >
        <Image src={"/TopoPagina2.svg"} alt="Ondas" width={15000} height={60} />
      </div>

      <div className="mx-auto w-full flex flex-row gap-16">
        {/* Coluna Esquerda (1/3) */}
        <div className="w-1/3 flex flex-col ml-32">
          <h1
            className="text-6xl font-bold whitespace-nowrap"
            style={{ fontFamily: "Red Hat Display" }}
          >
            Sobre os nossos
          </h1>
          <h1 className="text-pink-500 uppercase text-6xl ">Objetivos</h1>
        </div>

        {/* Coluna Direita (2/3) */}
        <div className="w-2/3 flex flex-col space-y-16">
          <div className="border-l-4 border-blue-500 pl-8 uppercase font-bold">
            <p className="text-2xl leading-relaxed">
              Organizar conteúdos educacionais de forma acessível
            </p>
          </div>

          <div className="border-l-4 border-blue-500 pl-8 uppercase font-bold">
            <p className="text-2xl leading-relaxed">
              Estimular a aprendizagem ativa por meio de apresentações
            </p>
          </div>

          <div className="border-l-4 border-blue-500 pl-8 uppercase font-bold">
            <p className="text-2xl leading-relaxed">
              Acompanhar o progresso dos usuários de forma estruturada
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Objetivos;
