export const siteConfig = {
  name: "Retífica Três Estrelas",
  since: 1990,
  whatsapp: {
    number: "5517991904957",
    display: "(17) 99190-4957",
  },
  address: {
    street: "Av. Dr. Aniloel Nazareth, 2375",
    city: "São José do Rio Preto – SP",
  },
  instagram: {
    handle: "@retificatresestrelas",
    url: "https://www.instagram.com/retificatresestrelas",
  },
};

export const navigation = [
  { label: "Início", href: "#inicio" },
  { label: "Serviços", href: "#servicos" },
  { label: "Veículos atendidos", href: "#veiculos" },
  { label: "Estrutura", href: "#estrutura" },
  { label: "Diferenciais", href: "#diferenciais" },
  { label: "Contato", href: "#contato" },
] as const;

export const problems = [
  { title: "Fumaça excessiva", icon: "cloud" },
  { title: "Perda de potência", icon: "gauge" },
  { title: "Consumo de óleo", icon: "oil" },
  { title: "Superaquecimento", icon: "temperature" },
  { title: "Ruídos no motor", icon: "sound" },
  { title: "Dificuldade para ligar", icon: "key" },
  { title: "Vazamentos", icon: "droplets" },
  { title: "Motor travado ou danificado", icon: "cog" },
] as const;

export const vehicles = [
  {
    title: "Camionetes e utilitários diesel",
    description:
      "Amarok, Ranger, Toro, Hilux, S10, Frontier e outros modelos.",
    image: "/veiculos/caminhonetes-utilitarios.jpg",
    alt: "Caminhonete diesel e veículo utilitário em ambiente de oficina",
  },
  {
    title: "Vans",
    description: "Master, Ducato, Sprinter e outros modelos.",
    image: "/veiculos/vans.jpg",
    alt: "Duas vans comerciais em ambiente de oficina",
  },
  {
    title: "Carros",
    description:
      "Motores flex, gasolina, três cilindros, turbo e outros motores leves.",
    image: "/veiculos/carros.jpg",
    alt: "Carro sedã e hatch em ambiente de oficina",
  },
  {
    title: "Agrícolas e caminhões",
    description: "Motores agrícolas e caminhões de diversas marcas.",
    image: "/veiculos/agricolas-caminhoes.jpg",
    alt: "Trator agrícola e caminhão em ambiente de manutenção",
  },
] as const;

export const services = [
  {
    title: "Retífica de motores",
    description:
      "Recuperação de desempenho e vida útil com critérios técnicos e controle dimensional.",
    image: "/servicos/servico-2.webp",
    alt: "Motor completo suspenso para serviço de retífica",
    icon: "settings",
  },
  {
    title: "Retífica de cabeçotes",
    description:
      "Planificação, inspeção e recuperação de cabeçotes conforme a necessidade.",
    image: "/servicos/servico-3.webp",
    alt: "Cabeçote de motor sobre bancada da oficina",
    icon: "layers",
  },
  {
    title: "Recuperação de blocos",
    description:
      "Usinagem e recuperação técnica de blocos danificados com máxima precisão.",
    image: "/servicos/servico-1.webp",
    alt: "Bloco de motor em processo de recuperação",
    icon: "box",
  },
  {
    title: "Virabrequins e componentes",
    description:
      "Avaliação e retífica de componentes para restaurar folgas e medidas especificadas.",
    image: "/servicos/servico-4.webp",
    alt: "Componentes de motor em processo técnico na oficina",
    icon: "component",
  },
  {
    title: "Montagem de motores",
    description:
      "Montagem completa com técnica, sequência correta e atenção aos detalhes.",
    image: "/servicos/servico-5.webp",
    alt: "Motor aberto preparado para montagem técnica",
    icon: "wrench",
  },
  {
    title: "Diagnóstico técnico",
    description:
      "Análise para identificar a causa do problema e orientar a solução adequada.",
    image: "/maquinas/maquina-1.webp",
    alt: "Máquina de precisão utilizada no diagnóstico e retífica",
    icon: "scan",
  },
] as const;

export const gallery = [
  {
    image: "/estrutura/interna-1.webp",
    alt: "Vista ampla do interior da oficina com vans e veículos",
    title: "Oficina",
  },
  {
    image: "/maquinas/maquina-2.webp",
    alt: "Máquina vermelha de precisão com cabeçote em processo",
    title: "Precisão",
  },
  {
    image: "/maquinas/maquina-3.webp",
    alt: "Equipamento vertical vermelho para serviços de retífica",
    title: "Equipamentos",
  },
  {
    image: "/servicos/servico-1.webp",
    alt: "Bloco de motor sendo recuperado na bancada",
    title: "Processo técnico",
  },
  {
    image: "/servicos/servico-6.webp",
    alt: "Máquina agrícola presente na área interna da oficina",
    title: "Linha pesada",
  },
] as const;

export const differentials = [
  { title: "Experiência desde 1990", icon: "award" },
  { title: "Atendimento completo", icon: "users" },
  { title: "Especialização em diesel", icon: "badge" },
  { title: "Garantia no serviço", icon: "shield" },
  { title: "Retirada e entrega", icon: "truck" },
  { title: "Atendimento regional", icon: "map" },
] as const;
