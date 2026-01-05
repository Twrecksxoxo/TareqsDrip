import { Product } from './types';

// NOTE: Copied and slightly adapted from chatbot project. This is a local in-memory product DB for the AI.
const productCatalog = [
  { name: "TEST MacBook Pro M3 Ultra", type: "Laptop", category: "Electronics", brand: "Apple", specs: "M3 Ultra chip, 64GB RAM, 1TB SSD, 16-inch Retina Display" },
  { name: "TEST Dell XPS 15 Premium", type: "Laptop", category: "Electronics", brand: "Dell", specs: "Intel i9-13900H, 32GB RAM, RTX 4070, 4K OLED Display" },
  { name: "TEST Lenovo ThinkPad X1 Carbon", type: "Laptop", category: "Electronics", brand: "Lenovo", specs: "Intel i7-1365U, 16GB RAM, 512GB SSD, Business Ultrabook" },
  { name: "TEST ASUS ROG Zephyrus G16", type: "Laptop", category: "Electronics", brand: "ASUS", specs: "RTX 4090, AMD Ryzen 9, 32GB RAM, 240Hz Gaming Display" },
  { name: "TEST HP Spectre x360", type: "Laptop", category: "Electronics", brand: "HP", specs: "Intel i7, 16GB RAM, 2-in-1 Convertible, OLED Touch Screen" },
  { name: "TEST Razer Blade 18 Gaming", type: "Laptop", category: "Electronics", brand: "Razer", specs: "RTX 4080, i9-13950HX, 32GB RAM, 18-inch QHD+ 240Hz" },
  { name: "TEST Microsoft Surface Laptop 5", type: "Laptop", category: "Electronics", brand: "Microsoft", specs: "Intel i7, 16GB RAM, PixelSense Display, Windows 11" },
  { name: "TEST Acer Predator Helios 300", type: "Laptop", category: "Electronics", brand: "Acer", specs: "RTX 4060, i7-13700H, 16GB RAM, 165Hz IPS Display" },
  ...Array.from({ length: 10 }, (_, i) => ({ name: `Gaming Laptop Pro ${i+1}`, type: "Laptop", category: "Electronics", brand: "TechBrand", specs: "RTX 4090, i9, 32GB RAM, Gaming-focused" })),
  ...Array.from({ length: 10 }, (_, i) => ({ name: `Smartphone Pro ${i+1}`, type: "Smartphone", category: "Electronics", brand: "PhonePro", specs: "6.7 inch, 256GB, 5G, Fast processor" })),
  ...Array.from({ length: 10 }, (_, i) => ({ name: `Wireless Earbuds ${i+1}`, type: "Earbuds", category: "Electronics", brand: "AudioPro", specs: "Active Noise Cancellation, 30hr battery" })),
  ...Array.from({ length: 10 }, (_, i) => ({ name: `Smart Watch ${i+1}`, type: "Watch", category: "Electronics", brand: "TimeGear", specs: "AMOLED, GPS, Heart rate" })),
  ...Array.from({ length: 10 }, (_, i) => ({ name: `4K Smart TV ${i+1}`, type: "TV", category: "Electronics", brand: "ScreenMax", specs: "4K UHD, HDR10, Smart OS" })),
  ...Array.from({ length: 10 }, (_, i) => ({ name: `Gaming Mouse ${i+1}`, type: "Mouse", category: "Electronics", brand: "Precision", specs: "16000 DPI, Wireless, RGB lighting" })),
  ...Array.from({ length: 10 }, (_, i) => ({ name: `Mechanical Keyboard ${i+1}`, type: "Keyboard", category: "Electronics", brand: "KeyMaster", specs: "Cherry MX, Programmable, RGB" })),
  ...Array.from({ length: 10 }, (_, i) => ({ name: `USB-C Hub ${i+1}`, type: "Hub", category: "Electronics", brand: "ConnectPro", specs: "7-in-1, Thunderbolt 3" })),
  ...Array.from({ length: 10 }, (_, i) => ({ name: `Portable SSD ${i+1}`, type: "SSD", category: "Electronics", brand: "StorageMax", specs: "2TB, 1050MB/s, Portable" })),
  ...Array.from({ length: 10 }, (_, i) => ({ name: `HD Webcam ${i+1}`, type: "Webcam", category: "Electronics", brand: "ViewPro", specs: "1080p, Auto focus, Built-in mic" })),
  // ...more items omitted for brevity, original dataset is large
];

const generateDB = (): Product[] => {
  const colors = ["Blue", "Black", "White", "Red", "Green", "Gray", "Navy", "Khaki", "Brown", "Pink", "Light Blue", "Dark Gray", "Cream", "Beige", "Charcoal", "Olive"];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const occasions = ["Casual", "Formal", "Sport", "Party"];
  const materials = ["Cotton", "Polyester", "Wool", "Leather", "Synthetic"];

  return productCatalog.map((item, index) => {
    const isClothing = item.category === "Clothing";
    let color: string | undefined;
    let size: string | undefined;
    let occasion: string | undefined;
    let material: string | undefined;

    if (isClothing) {
      color = colors[index % colors.length];
      size = sizes[Math.floor(index / colors.length) % sizes.length];
      if (item.type === "Dress" || item.type === "Blazer") {
        occasion = "Formal";
      } else if (item.type === "T-Shirt" || item.type === "Jeans" || item.type === "Shorts") {
        occasion = "Casual";
      } else if (item.type === "Sports Hoodie" || item.type === "Running Shoes") {
        occasion = "Sport";
      } else {
        occasion = occasions[index % occasions.length];
      }

      if (item.type === "T-Shirt" || item.type === "Thermal Leggings") {
        material = "Cotton";
      } else if (item.type === "Jacket") {
        material = "Polyester";
      } else if (item.type === "Blazer") {
        material = "Wool";
      } else {
        material = materials[index % materials.length];
      }
    }

    return {
      id: index + 1,
      name: item.name,
      type: item.type,
      category: item.category,
      brand: item.brand,
      specs: item.specs,
      price: Math.round((Math.random() * 400 + 30) * 100) / 100,
      stock: Math.floor(Math.random() * 100 + 5),
      rating: Math.round((Math.random() * 2 + 3.5) * 10) / 10,
      reviews: Math.floor(Math.random() * 500 + 20),
      available: Math.random() > 0.08,
      onSale: Math.random() > 0.75,
      discount: Math.floor(Math.random() * 45 + 5),
      warranty: `${Math.floor(Math.random() * 3 + 1)} Year Warranty`,
      color: isClothing ? color : undefined,
      size: isClothing ? size : undefined,
      occasion: isClothing ? occasion : undefined,
      material: isClothing ? material : undefined
    };
  });
};

export const DB: Product[] = generateDB();

export const searchProducts = (
  category?: string,
  productType?: string,
  attributes?: string[],
  minPrice?: number,
  maxPrice?: number
): Product[] => {
  let results = DB.filter(p => p.available);

  if (category) {
    results = results.filter(p =>
      p.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (productType) {
    const pType = productType.toLowerCase();
    results = results.filter(p =>
      p.type.toLowerCase() === pType ||
      p.type.toLowerCase().includes(pType) ||
      pType.includes(p.type.toLowerCase())
    );
  }

  if (attributes && attributes.length > 0) {
    results = results.filter(p =>
      attributes.some(attr =>
        p.name.toLowerCase().includes(attr.toLowerCase()) ||
        p.specs.toLowerCase().includes(attr.toLowerCase())
      )
    );
  }

  if (minPrice !== undefined) {
    results = results.filter(p => p.price >= minPrice);
  }

  if (maxPrice !== undefined) {
    results = results.filter(p => p.price <= maxPrice);
  }

  return results;
};

export const getProductById = (id: number): Product | undefined => {
  return DB.find(p => p.id === id);
};

export const getDealProducts = (): Product[] => {
  return DB.filter(p => p.available && p.onSale)
    .sort((a, b) => b.discount - a.discount)
    .slice(0, 20);
};

export const getRecommendedProducts = (): Product[] => {
  return DB.filter(p => p.available)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 20);
};

export const getBudgetProducts = (maxPrice: number): Product[] => {
  return DB.filter(p => p.available && p.price <= maxPrice)
    .sort((a, b) => a.price - b.price)
    .slice(0, 20);
};

