// lib/slug.ts
export function createSlug(text: string): string {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove acentos
      .replace(/^formação\s+/i, "") // Remove "Formação" do início
      .replace(/\s+/g, "-") // Substitui espaços por hífens
      .replace(/[^\w\-]+/g, "") // Remove caracteres especiais
      .replace(/\-\-+/g, "-") // Substitui múltiplos hífens por um
      .trim();
  }
  
  export function getFormacaoNameFromSlug(slug: string): string {
    // Remove "formacao-" do início se existir
    const cleanSlug = slug.replace(/^formacao-/, "");
    
    // Converte o slug de volta para o nome da formação
    const formatted = cleanSlug
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    
    return `Formação ${formatted}`;
  }