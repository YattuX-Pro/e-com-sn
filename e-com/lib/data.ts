export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  shortDescription: string;
  category: string;
  image: string;
  images: string[];
  bestSeller: boolean;
  stock: number;
}

export const categories = [
  "Tous",
  "Transport de marchandises",
  "Transport de passagers",
  "Agriculture",
  "Électrique",
];

export const products: Product[] = [
  {
    id: "1",
    name: "Hasilaza Cargo 200",
    price: 1850000,
    description: "Le Hasilaza Cargo 200 est un tricycle robuste conçu pour le transport de marchandises lourdes. Équipé d'un moteur 200cc puissant et fiable, il peut transporter jusqu'à 1 tonne de charge. Idéal pour les commerçants et les agriculteurs. Caractéristiques: Moteur 4 temps refroidi par air, Démarrage électrique et kick, Freins à tambour avant et arrière, Benne basculante en option.",
    shortDescription: "Tricycle cargo robuste 200cc - Capacité 1 tonne",
    category: "Transport de marchandises",
    image: "/file/01.jpeg",
    images: ["/file/01.jpeg"],
    bestSeller: true,
    stock: 15,
  },
  {
    id: "2",
    name: "Hasilaza Passenger 150",
    price: 1650000,
    description: "Le Hasilaza Passenger 150 est parfait pour le transport de passagers en zone urbaine et rurale. Confortable et économique, il peut accueillir jusqu'à 4 passagers. Moteur 150cc économe en carburant.",
    shortDescription: "Tricycle passagers 150cc - 4 places",
    category: "Transport de passagers",
    image: "/file/01.jpeg",
    images: ["/file/01.jpeg"],
    bestSeller: true,
    stock: 12,
  },
  {
    id: "3",
    name: "Hasilaza Agri Pro",
    price: 2100000,
    description: "Conçu spécialement pour les travaux agricoles, le Hasilaza Agri Pro dispose d'une transmission renforcée et d'une garde au sol élevée. Parfait pour les terrains difficiles.",
    shortDescription: "Tricycle agricole renforcé - Tout terrain",
    category: "Agriculture",
    image: "/file/01.jpeg",
    images: ["/file/01.jpeg"],
    bestSeller: false,
    stock: 8,
  },
  {
    id: "4",
    name: "Hasilaza E-Cargo",
    price: 2450000,
    description: "Version électrique du cargo classique. Zéro émission, faible coût d'exploitation. Autonomie de 80km. Idéal pour les livraisons en ville.",
    shortDescription: "Tricycle électrique cargo - 80km autonomie",
    category: "Électrique",
    image: "/file/01.jpeg",
    images: ["/file/01.jpeg"],
    bestSeller: true,
    stock: 6,
  },
  {
    id: "5",
    name: "Hasilaza Cargo 250",
    price: 2050000,
    description: "Version améliorée du Cargo 200 avec un moteur plus puissant de 250cc. Capacité de charge augmentée à 1.5 tonnes. Pour les professionnels exigeants.",
    shortDescription: "Tricycle cargo puissant 250cc - Capacité 1.5 tonnes",
    category: "Transport de marchandises",
    image: "/file/01.jpeg",
    images: ["/file/01.jpeg"],
    bestSeller: false,
    stock: 10,
  },
  {
    id: "6",
    name: "Hasilaza Mini Cargo",
    price: 1350000,
    description: "Tricycle compact idéal pour les petites livraisons urbaines. Facile à manœuvrer dans les rues étroites. Moteur 125cc économique.",
    shortDescription: "Tricycle compact 125cc - Livraison urbaine",
    category: "Transport de marchandises",
    image: "/file/01.jpeg",
    images: ["/file/01.jpeg"],
    bestSeller: false,
    stock: 20,
  },
  {
    id: "7",
    name: "Hasilaza E-Passenger",
    price: 2250000,
    description: "Tricycle électrique pour transport de passagers. Silencieux et confortable. Autonomie de 100km. Parfait pour le taxi urbain écologique.",
    shortDescription: "Tricycle électrique passagers - 100km autonomie",
    category: "Électrique",
    image: "/file/01.jpeg",
    images: ["/file/01.jpeg"],
    bestSeller: false,
    stock: 5,
  },
  {
    id: "8",
    name: "Hasilaza Deluxe 200",
    price: 1950000,
    description: "Version luxe avec finitions premium. Siège conducteur ergonomique, tableau de bord complet, phares LED. Pour ceux qui veulent le meilleur.",
    shortDescription: "Tricycle premium 200cc - Finitions luxe",
    category: "Transport de passagers",
    image: "/file/01.jpeg",
    images: ["/file/01.jpeg"],
    bestSeller: true,
    stock: 7,
  },
];

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-SN', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price) + ' FCFA';
};
