import Image from "next/image";

const About = () => {
  return (
    <section className="w-full min-h-screen flex items-center justify-center bg-[#fffbf3] pt-0">
      <div className=" w-full flex h-full">
        {/* Lado esquerdo azul */}
        <div className="w-1/2 bg-blue-500 min-h-screen">
          <Image
            src={"computerteia.svg"}
            alt="Imagem de computador"
            width={1000}
            height={1000}
          />
        </div>
        {/* Lado direito com texto */}
        <div className="w-1/2 flex flex-col justify-center text-center p-12">
          <h2 className="text-4xl font-bold  uppercase text-left">
            Sobre o nosso <br></br> aplicativo
          </h2>
          <p className="mt-4 text-lg text-gray-700 text-justify">
              O <span className="font-bold">WIKITEIA</span> é uma plataforma web
              que conecta aprendizado e prática, proporcionando um ambiente
              dinâmico para estudos e desenvolvimento acadêmico. Nosso objetivo é
              oferecer um espaço organizado e interativo onde os usuários podem
              acessar videoaulas, criar apresentações originais e receber
              feedbacks construtivos.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
