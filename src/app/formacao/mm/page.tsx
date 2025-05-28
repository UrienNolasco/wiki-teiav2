import FormacaoServer from "@/components/formacao/formacaoserver";

export const revalidate = 0;

const Abap = () => {
  return (
      <div className="container mx-auto animate-fade-in">
          <div className="p-8 space-y-8 ">
            <FormacaoServer tipoFormacao="Formação MM" />
          </div>
      </div>
  );
};

export default Abap;
