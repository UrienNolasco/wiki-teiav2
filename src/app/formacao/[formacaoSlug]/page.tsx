import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";

import { getFormacaoBySlug } from "@/app/actions/formacao/getFormacaoBySlug";
import FormacaoContent from "@/components/formacao/formacaocontent";
import { authOptions } from "@/lib/auth";

export const revalidate = 0;

interface FormacaoPageProps {
  params: Promise<{
    formacaoSlug: string;
  }>;
}

export default async function FormacaoPage({ params }: FormacaoPageProps) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return <p>Usuário não autenticado.</p>;
  }

  // Await params
  const { formacaoSlug } = await params;

  const formacao = await getFormacaoBySlug(formacaoSlug, userId);

  if (!formacao) {
    notFound();
  }

  return (
    <div className="container mx-auto animate-fade-in">
      <div className="p-8 space-y-8">
        <FormacaoContent formacao={formacao} formacaoSlug={formacaoSlug} />
      </div>
    </div>
  );
}