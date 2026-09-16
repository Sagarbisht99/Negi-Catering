export type FoodItem = {
  id: string;
  name: string;
  image: string;
  category: string;
  description?: string;
};

export const foodCategories = [
  "All",
  "Starters",
  "Main Course",
  "Breads & Rice",
  "Live Counters",
  "Desserts",
  "Beverages",
  "Thalis",
] as const;

export type FoodCategory = (typeof foodCategories)[number];

export const adminFoodCategories = foodCategories.filter(
  (category): category is Exclude<FoodCategory, "All"> => category !== "All",
);

/** Placeholder menu — replace via admin panel later */
export const foodItems: FoodItem[] = [
  {
    id: "starter-1",
    name: "Paneer Tikka",
    image: "/images/tikka.jpg",
    category: "Starters",
  },
  {
    id: "starter-2",
    name: "Veg Spring Roll",
    image: "/images/salad.jpg",
    category: "Starters",
  },
  {
    id: "starter-3",
    name: "Hara Bhara Kebab",
    image: "/images/kebabs.jpg",
    category: "Starters",
  },
  {
    id: "starter-4",
    name: "Corn Seekh",
    image: "/images/grill.jpg",
    category: "Starters",
  },
  {
    id: "main-1",
    name: "Dal Makhani",
    image: "/images/curry.jpg",
    category: "Main Course",
  },
  {
    id: "main-2",
    name: "Shahi Paneer",
    image: "/images/paneer.jpg",
    category: "Main Course",
  },
  {
    id: "main-3",
    name: "Seasonal Sabzi",
    image: "/images/festive.jpg",
    category: "Main Course",
  },
  {
    id: "main-4",
    name: "Chole Masala",
    image: "/images/trays.jpg",
    category: "Main Course",
  },
  {
    id: "bread-1",
    name: "Butter Naan",
    image: "/images/naan.jpg",
    category: "Breads & Rice",
  },
  {
    id: "bread-2",
    name: "Tandoori Roti",
    image: "/images/bread.jpg",
    category: "Breads & Rice",
  },
  {
    id: "rice-1",
    name: "Veg Biryani",
    image: "/images/biryani.jpg",
    category: "Breads & Rice",
  },
  {
    id: "rice-2",
    name: "Jeera Rice",
    image: "/images/thali.jpg",
    category: "Breads & Rice",
  },
  {
    id: "live-1",
    name: "Live Pasta",
    image: "/images/pasta.jpg",
    category: "Live Counters",
  },
  {
    id: "live-2",
    name: "Live Chaat",
    image: "/images/chaat.jpg",
    category: "Live Counters",
  },
  {
    id: "live-3",
    name: "Live Dosa",
    image: "/images/dosa.jpg",
    category: "Live Counters",
  },
  {
    id: "live-4",
    name: "Live Grill",
    image: "/images/grill.jpg",
    category: "Live Counters",
  },
  {
    id: "dessert-1",
    name: "Gulab Jamun",
    image: "/images/gulab.jpg",
    category: "Desserts",
  },
  {
    id: "dessert-2",
    name: "Rasmalai",
    image: "/images/sweets.jpg",
    category: "Desserts",
  },
  {
    id: "dessert-3",
    name: "Chocolate Cake",
    image: "/images/cake.jpg",
    category: "Desserts",
  },
  {
    id: "dessert-4",
    name: "Ice Cream Counter",
    image: "/images/drinks.jpg",
    category: "Desserts",
  },
  {
    id: "bev-1",
    name: "Fresh Lime Soda",
    image: "/images/drinks.jpg",
    category: "Beverages",
  },
  {
    id: "bev-2",
    name: "Masala Chai",
    image: "/images/chai.jpg",
    category: "Beverages",
  },
  {
    id: "bev-3",
    name: "Mocktail Bar",
    image: "/images/festive.jpg",
    category: "Beverages",
  },
  {
    id: "bev-4",
    name: "Buttermilk",
    image: "/images/diya.jpg",
    category: "Beverages",
  },
  {
    id: "thali-1",
    name: "Executive Thali",
    image: "/images/thali.jpg",
    category: "Thalis",
  },
  {
    id: "thali-2",
    name: "Wedding Thali",
    image: "/images/feast.jpg",
    category: "Thalis",
  },
  {
    id: "thali-3",
    name: "Pooja Prashad Thali",
    image: "/images/diya.jpg",
    category: "Thalis",
  },
  {
    id: "thali-4",
    name: "Festival Special Thali",
    image: "/images/festive.jpg",
    category: "Thalis",
  },
];
