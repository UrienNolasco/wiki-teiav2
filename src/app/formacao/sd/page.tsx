import FormacaoServer from "@/components/formacao/formacaoserver";

export const revalidate = 0;

const Sd = () => {
  return (
      <div className="container mx-auto animate-fade-in">
          <div className="p-8 space-y-8 ">
            <FormacaoServer tipoFormacao="Formação SD" />
          </div>
      </div>
  );
};

export default Sd;
