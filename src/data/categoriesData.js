import { 
  Tag, TrendingUp, Laptop, Monitor, Smartphone, Speaker, Zap, 
  Refrigerator, Snowflake, UtensilsCrossed, Armchair, Bike, 
  Palette, Scissors, Plug, Package, Watch, Rocket, Briefcase, 
  Wrench, Gamepad2
} from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient.js';

const createSubcategories = (names) => names.map(name => ({
  id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  name: name
}));

export const categories = [
  { 
    id: 'promo', 
    name: 'PROMO', 
    icon: Tag, 
    color: '#EF4444', 
    emoji: '🏷️',
    subcategories: createSubcategories(['Ventes Flash', 'Bons Plans', 'Liquidation', 'Packs Promo']) 
  },
  { 
    id: 'tendances', 
    name: 'TENDANCES', 
    icon: TrendingUp, 
    color: '#F97316', 
    emoji: '🔥',
    subcategories: createSubcategories(['Nouveautés', 'Meilleures Ventes', 'Populaire', 'Recommandés']) 
  },
  { 
    id: 'informatique', 
    name: 'INFORMATIQUE', 
    icon: Laptop, 
    color: '#3B82F6', 
    emoji: '💻',
    subcategories: createSubcategories(['Ordinateurs portables', 'Ordinateurs de bureau', 'Imprimantes', 'Stockage']) 
  },
  { 
    id: 'ordinateurs', 
    name: 'ORDINATEURS', 
    icon: Monitor, 
    color: '#1E40AF', 
    emoji: '🖥️',
    subcategories: createSubcategories(['Moniteurs', 'PC Gamer', 'All-in-One', 'Accessoires PC']) 
  },
  { 
    id: 'telephonie', 
    name: 'TÉLÉPHONE & TABLETTE', 
    icon: Smartphone, 
    color: '#0EA5E9', 
    emoji: '📱',
    subcategories: createSubcategories(['Smartphones', 'iPhones', 'Tablettes', 'Accessoires']) 
  },
  { 
    id: 'image-son', 
    name: 'IMAGE & SON', 
    icon: Speaker, 
    color: '#8B5CF6', 
    emoji: '🔊',
    subcategories: createSubcategories(['Enceintes', 'Casques', 'Home Cinéma', 'Microphones']) 
  },
  { 
    id: 'electronique', 
    name: 'ÉLECTRONIQUE', 
    icon: Zap, 
    color: '#6B7280', 
    emoji: '⚡',
    subcategories: createSubcategories(['Composants', 'Batteries', 'Câbles', 'Chargeurs']) 
  },
  { 
    id: 'electromenager', 
    name: 'ÉLECTROMÉNAGER', 
    icon: Refrigerator, 
    color: '#3B82F6', 
    emoji: '🧊',
    subcategories: createSubcategories(['Réfrigérateurs', 'Lave-linge', 'Micro-ondes', 'Fours']) 
  },
  { 
    id: 'climatiseurs', 
    name: 'CLIMATISEURS', 
    icon: Snowflake, 
    color: '#06B6D4', 
    emoji: '❄️',
    subcategories: createSubcategories(['Split mobile', 'Split mural', 'Ventilateurs', 'Purificateurs']) 
  },
  { 
    id: 'cuisine', 
    name: 'CUISINE', 
    icon: UtensilsCrossed, 
    color: '#F97316', 
    emoji: '🍳',
    subcategories: createSubcategories(['Batterie de cuisine', 'Couteaux', 'Robots', 'Vaisselle']) 
  },
  { 
    id: 'mobiliers', 
    name: 'MOBILIERS', 
    icon: Armchair, 
    color: '#92400E', 
    emoji: '🪑',
    subcategories: createSubcategories(['Canapés', 'Tables', 'Chaises', 'Lits']) 
  },
  { 
    id: 'motos', 
    name: 'MOTOS & PIÈCES', 
    icon: Bike, 
    color: '#1F2937', 
    emoji: '🏍️',
    subcategories: createSubcategories(['Motos', 'Casques', 'Pièces détachées', 'Accessoires']) 
  },
  { 
    id: 'cosmetiques', 
    name: 'COSMÉTIQUES', 
    icon: Palette, 
    color: '#EC4899', 
    emoji: '💄',
    subcategories: createSubcategories(['Maquillage', 'Soins visage', 'Parfums', 'Soins corps']) 
  },
  { 
    id: 'coiffure', 
    name: 'SALON DE COIFFURE', 
    icon: Scissors, 
    color: '#A855F7', 
    emoji: '✂️',
    subcategories: createSubcategories(['Lisseurs', 'Sèche-cheveux', 'Tondeuses', 'Produits pro']) 
  },
  { 
    id: 'connectique', 
    name: 'CONNECTIQUE', 
    icon: Plug, 
    color: '#EAB308', 
    emoji: '🔌',
    subcategories: createSubcategories(['Câbles USB', 'Adaptateurs', 'Prises', 'Rallonges']) 
  },
  { 
    id: 'consommables', 
    name: 'CONSOMMABLES', 
    icon: Package, 
    color: '#9CA3AF', 
    emoji: '📦',
    subcategories: createSubcategories(['Cartouches', 'Papier', 'Toners', 'Etiquettes']) 
  },
  { 
    id: 'objets-connectes', 
    name: 'OBJETS CONNECTÉS', 
    icon: Watch, 
    color: '#0EA5E9', 
    emoji: '⌚',
    subcategories: createSubcategories(['Montres', 'Bracelets', 'Balance connectée', 'Domotique']) 
  },
  { 
    id: 'high-tech', 
    name: 'HIGH TECH', 
    icon: Rocket, 
    color: '#10B981', 
    emoji: '🚀',
    subcategories: createSubcategories(['Drones', 'VR', 'Imprimantes 3D', 'Gadgets']) 
  },
  { 
    id: 'accessoires', 
    name: 'ACCESSOIRES', 
    icon: Briefcase, 
    color: '#B45309', 
    emoji: '👜',
    subcategories: createSubcategories(['Sacs', 'Coques', 'Verres trempés', 'Supports']) 
  },
  { 
    id: 'outils', 
    name: 'OUTILS MAISON', 
    icon: Wrench, 
    color: '#F97316', 
    emoji: '🛠️',
    subcategories: createSubcategories(['Perceuses', 'Tournevis', 'Marteaux', 'Kits outils']) 
  },
  { 
    id: 'jeux', 
    name: 'JEUX & LOISIRS', 
    icon: Gamepad2, 
    color: '#8B5CF6', 
    emoji: '🎮',
    subcategories: createSubcategories(['Consoles', 'Jeux vidéo', 'Jouets', 'Plein air']) 
  },
  { 
    id: 'divers', 
    name: 'DIVERS', 
    icon: Package, 
    color: '#6B7280', 
    emoji: '📦',
    subcategories: createSubcategories(['Bazar', 'Rangement', 'Nettoyage', 'Autres']) 
  }
];

let listeners = [];

export const subscribeToCategories = (listener) => {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
};

const notifyListeners = () => {
  listeners.forEach(listener => listener([...categories]));
};

export const fetchAndUpdateSubcategories = async () => {
  try {
    const { data: dbCategories, error: catError } = await supabase.from('kayjoko_categories').select('*');
    const { data: dbSubcategories, error: subError } = await supabase.from('kayjoko_subcategories').select('*');

    if (catError) console.error("Error fetching categories:", catError);
    if (subError) console.error("Error fetching subcategories:", subError);

    if (dbCategories && dbSubcategories) {
      categories.forEach(cat => {
        const dbCat = dbCategories.find(c => c.name.toLowerCase() === cat.name.toLowerCase());
        if (dbCat) {
          cat.dbId = dbCat.id; // Store DB UUID
          const relatedSubs = dbSubcategories.filter(sub => sub.category_id === dbCat.id);
          if (relatedSubs.length > 0) {
            // Replace static subcategories with the actual DB subcategories to preserve correct UUIDs
            cat.subcategories = relatedSubs.map(sub => ({
              id: sub.id, // This is now a UUID
              name: sub.name
            }));
          }
        }
      });
      notifyListeners();
    }
  } catch (err) {
    console.error("Failed to fetch and update subcategories:", err);
  }
};

export const getAllCategories = () => categories;

export const getCategoryById = (id) => categories.find(c => c.id === id);

export const getCategoryByName = (name) => categories.find(c => c.name.toLowerCase() === name?.toLowerCase());

export const getSubcategoriesByCategory = (categoryIdOrName) => {
  const category = categories.find(c => c.id === categoryIdOrName || c.name === categoryIdOrName);
  return category ? category.subcategories : [];
};