
// Mock user profiles
export type ProfileType = {
  id: number;
  name: string;
  count: number;
  permissions: string[];
};

export const profiles: ProfileType[] = [
  {
    id: 1,
    name: "Admin",
    count: 1,
    permissions: ["downloads", "ratings", "errors", "feedbacks", "features"]
  },
  {
    id: 2,
    name: "Desenvolvedor",
    count: 2,
    permissions: ["downloads", "ratings", "errors"]
  },
  {
    id: 3,
    name: "Recursos Humanos",
    count: 1,
    permissions: ["feedbacks", "downloads", "ratings"]
  }
];

// Mock users data
export type UserType = {
  id: number;
  name: string;
  email: string;
  profile: string;
  status: "ATIVO" | "INATIVO";
  password: string; // In a real app, we would never store passwords in plain text
};

export const users: UserType[] = [
  {
    id: 1,
    name: "Junior Luiz",
    email: "junior@convicti.com.br",
    profile: "Admin",
    status: "ATIVO",
    password: "password123"
  },
  {
    id: 2,
    name: "João Lucas",
    email: "joao.lucas@convicti.com.br",
    profile: "Desenvolvedor",
    status: "ATIVO",
    password: "password123"
  },
  {
    id: 3,
    name: "Clécia Lopes",
    email: "clecia.lopes@convicti.com.br",
    profile: "Recursos Humanos",
    status: "ATIVO",
    password: "password123"
  },
  {
    id: 4,
    name: "Ricardo Dantas",
    email: "ricardo@convicti.com.br",
    profile: "Admin",
    status: "ATIVO",
    password: "password123"
  }
];

// Mock statistics data
export const statistics = {
  downloads: {
    total: 330,
    android: 240,
    ios: 90,
    icon: "download"
  },
  ratings: {
    average: 4.2,
    android: 5.0,
    ios: 4.0,
    icon: "star"
  },
  errors: {
    total: 4,
    android: 2,
    ios: 1,
    change: "-5%",
    icon: "x-circle"
  }
};

// Mock feedback data
export type FeedbackType = {
  id: number;
  text: string;
  date: string;
  rating: number;
  improvements?: string;
  platform: "Android" | "iOS";
};

export const feedbacks: FeedbackType[] = [
  {
    id: 1,
    text: "Aplicativo muito bom, muito intuitivo. Até agora, não encontrei nenhum tipo de falha. Quando vou entrar o aplicativo sempre carrega rápido da primeira vez quando não estou usando meus dados da proteção dos nossos operadores, mas quando preciso consultar os meus extratos, sempre não trás essas plataforma.",
    date: "01/04/24",
    rating: 4,
    improvements: "Dados de Produção, Suporte ao Usuário",
    platform: "Android"
  },
  {
    id: 2,
    text: "Aplicativo muito bom, porém poderiam atualizar visualmente com os dados da qualidade.",
    date: "30/03/24",
    rating: 5,
    improvements: "-",
    platform: "iOS"
  }
];

// Mock features data
export type FeatureType = {
  id: number;
  name: string;
  usage: number;
};

export const features: FeatureType[] = [
  {
    id: 1,
    name: "Veículo Em Rota",
    usage: 92
  },
  {
    id: 2,
    name: "Avaliação De Coleta",
    usage: 78
  }
];
