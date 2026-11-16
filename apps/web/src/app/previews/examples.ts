export type PreviewKind = "arvore" | "memorias" | "conexoes" | "perfis" | "manifesto" | "cuidado";

export const sections: Record<PreviewKind, { label: string; eyebrow: string; title: string; description: string }> = {
  arvore: { label: "Nossa árvore", eyebrow: "NOSSA ÁRVORE / EXPLORAÇÃO", title: "Raízes no que vivemos.", description: "Um estudo visual sobre os gestos e as histórias que aproximam." },
  memorias: { label: "Memórias", eyebrow: "MEMÓRIAS / EXPLORAÇÃO", title: "Há instantes que ficam.", description: "Uma ideia de espaço para reencontrar pequenas histórias, no tempo de vocês." },
  conexoes: { label: "Conexões", eyebrow: "CONEXÕES / EXPLORAÇÃO", title: "Conhecer para cuidar.", description: "Pequenas pistas sobre o que aproxima. Sem comparar ou pontuar pessoas." },
  perfis: { label: "Perfis afetivos", eyebrow: "PERFIS AFETIVOS / EXPLORAÇÃO", title: "Um jeito único de estar no Nós.", description: "Um conceito de perfil que respeita o que cada pessoa escolhe compartilhar." },
  manifesto: { label: "Nosso manifesto", eyebrow: "MANIFESTO / EXPLORAÇÃO", title: "O que escolhemos cultivar.", description: "Palavras que poderiam traduzir a intenção de um Núcleo." },
  cuidado: { label: "Ponte do Nós", eyebrow: "PONTE DO NÓS / EXPLORAÇÃO", title: "Conversar também é um cuidado.", description: "Uma proposta de preparação para conversas presenciais, com espaço para escutar." },
};

export const roots = [
  { key: "proposito", label: "Propósito", title: "Mais presença. Mais espaço para nós.", text: "Uma intenção compartilhada poderia aparecer nas raízes desta árvore. Cada Núcleo teria suas próprias palavras." },
  { key: "gestos", label: "Pequenos gestos", title: "Cada gesto encontra seu tempo.", text: "Uma forma de representar o cuidado cotidiano. Este desenho não mede atividade, evolução individual ou qualidade dos vínculos." },
  { key: "historias", label: "Histórias", title: "O que vivemos também cria raízes.", text: "Memórias e marcos poderiam compor esta paisagem, sempre com regras de privacidade e escolhas de compartilhamento a definir." },
];

export const memories = [
  { title: "O domingo no parque", type: "Encontros", tone: "green", date: "Um domingo de primavera", text: "A sombra de uma árvore, uma toalha na grama e tempo para conversar sem pressa. Às vezes, o simples fica.", caption: "Uma pausa no mundo. Um encontro entre nós." },
  { title: "Nossa primeira caminhada", type: "Pequenos gestos", tone: "amber", date: "Uma manhã de descobertas", text: "Escolhemos um caminho diferente e encontramos uma conversa que ainda não tinha acontecido. Não havia destino urgente.", caption: "O caminho também pode ser um lugar de encontro." },
  { title: "Uma mesa e boas histórias", type: "Encontros", tone: "rose", date: "Uma noite para lembrar", text: "Cada pessoa trouxe uma história. Entre pratos e risadas, descobrimos um pouco mais sobre quem estava à mesa.", caption: "Cabia mais do que o jantar naquela mesa." },
];

export const people = [
  { name: "Ana", initials: "AN", tone: "rose", about: "Gosto de dias tranquilos, de cozinhar com companhia e de conversas que não precisam ter uma conclusão.", care: "Uma mensagem no meio do dia. Companhia sem precisar preencher o silêncio.", likes: ["Café passado", "Caminhadas", "Cozinhar junto"], wish: "Aprender uma receita nova a quatro mãos.", date: "Um aniversário em novembro · data fictícia" },
  { name: "Lucas", initials: "LU", tone: "blue", about: "Me sinto perto quando encontro tempo para estar presente. Música e pequenos passeios costumam abrir boas conversas.", care: "Um convite com antecedência e liberdade para dizer como estou me sentindo.", likes: ["Música ao vivo", "Passeios", "Cinema em casa"], wish: "Conhecer um lugar novo, sem roteiro apertado.", date: "Um aniversário em março · data fictícia" },
  { name: "Bia", initials: "BI", tone: "green", about: "Guardo carinho por histórias, plantas e encontros ao redor da mesa. Gosto de escutar como foi o dia de quem está perto.", care: "Escuta com tempo. Lembrar de um detalhe que compartilhei.", likes: ["Livros", "Plantas", "Histórias de família"], wish: "Organizar uma tarde de histórias e fotografias.", date: "Um aniversário em agosto · data fictícia" },
];

export const topics = [
  { key: "care", label: "Pistas de cuidado" },
  { key: "likes", label: "Gostos e afinidades" },
  { key: "wish", label: "Desejos" },
] as const;

export const principles = [
  { title: "Escutar com respeito", text: "Criar espaço para ouvir até o fim, sem transformar uma diferença em disputa. A escuta pode começar por uma pergunta simples: como isso foi para você?", tone: "blue" },
  { title: "Fazer espaço para cada pessoa", text: "Reconhecer jeitos, limites e tempos diferentes. Participar de um Núcleo não significa abrir mão das próprias escolhas.", tone: "purple" },
  { title: "Cultivar pequenos cuidados", text: "Valorizar gestos possíveis na vida real. Um cuidado faz sentido quando respeita quem oferece e quem recebe.", tone: "rose" },
  { title: "Permitir que os combinados amadureçam", text: "Revisitar o que foi escolhido, conversar sobre o que mudou e dar espaço para rever uma participação com liberdade.", tone: "green" },
];
