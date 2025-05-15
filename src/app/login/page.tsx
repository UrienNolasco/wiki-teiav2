"use client";

import About from "@/components/login/about";
import Contato from "@/components/login/contato";
import Hero from "@/components/login/hero";
import Objetivos from "@/components/login/objetivos";
import Recursos from "@/components/login/recursos";



const LoginPage = () => {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between scroll [&::-webkit-scrollbar]:hidden">
        {/* Seção Hero */}
        <Hero />

        {/* Seção Hero */}
        <About />

        {/* Seção Experiencias */}
        <Recursos />

        {/* Seção Projetos */}
        <Objetivos />
        {/* Seção Contato */}
        <Contato />
      </main>
    </>
  );
};

export default LoginPage;
