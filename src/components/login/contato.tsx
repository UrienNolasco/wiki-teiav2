import Image from "next/image";

const Contato = () => {
  return (
    <section className="h-auto w-full bg-[#fffbf3] flex relative">
      {/* Coluna Esquerda - Informações de Contato */}
      <Image
        className="absolute bottom-0 right-0 z-0"
        src={"squarescontato.svg"}
        alt="Imagem de fundo"
        width={900}
        height={900}
      />
      <div className="w-1/2 h-full flex flex-col justify-center pl-32 mt-40">
        <h1
          className="font-bold text-6xl mb-12"
          style={{ fontFamily: "Red Hat Display" }}
        >
          Contato
        </h1>

        <div className="space-y-8">
          <div>
            <h2 className="uppercase font-bold text-lg">Telefone</h2>
            <p className="underline text-xl">(51) 3017-1251</p>
          </div>

          <div>
            <h2 className="uppercase font-bold text-lg">Email</h2>
            <p className="text-xl">teia@teiaconnect.com</p>
          </div>

          <div>
            <h2 className="uppercase font-bold text-lg mb-4">Redes sociais</h2>
            <div className="flex gap-6">
              <Image
                src="/facebook-176-svgrepo-com.svg"
                alt="Facebook"
                width={32}
                height={32}
                className="hover:opacity-75 transition-opacity"
              />
              <Image
                src="/instagram-svgrepo-com.svg"
                alt="Instagram"
                width={32}
                height={32}
                className="hover:opacity-75 transition-opacity"
              />
              <Image
                src="/linkedin-svgrepo-com.svg"
                alt="LinkedIn"
                width={38}
                height={38}
                className="hover:opacity-75 transition-opacity"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Coluna Direita - Imagem */}
      <div className="w-1/2 h-full flex items-center justify-center pr-32 mt-40 mb-40">
        <div className="relative w-full h-[370px] ml-10 ">
          <Image
            src="/1735951199020.jpeg"
            alt="Teia"
            width={400}
            height={370}
            className="object-cover rounded-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default Contato;
