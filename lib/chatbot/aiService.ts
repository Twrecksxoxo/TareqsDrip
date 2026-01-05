import { DB, searchProducts, getProductById, getDealProducts, getRecommendedProducts, getBudgetProducts } from './productDatabase';
import { Product, SearchParams } from './types';

export interface AIResponse {
  text: string;
  products: Product[];
  isConversationalOnly: boolean;
}

export class AIService {
  private static extractKeywords(input: string): string[] {
    return input.toLowerCase().split(/[\s,;.!?-]+/).filter(word => word.length > 2 && !this.isCommonWord(word));
  }

  private static isCommonWord(word: string): boolean {
    const commonWords = ["the", "and", "for", "are", "you", "can", "can", "any", "all", "get", "show", "find", "want", "need", "like", "give", "have", "what", "where"];
    return commonWords.includes(word);
  }

  private static getColorPairings(): Record<string, string[]> {
    return {
      "black": ["white", "cream", "light blue", "light gray", "khaki", "beige", "navy", "gray", "gold", "silver"],
      "white": ["black", "blue", "gray", "red", "navy", "khaki", "olive", "blush", "coral"],
      "navy": ["white", "cream", "khaki", "beige", "gray", "light blue", "gold", "coral", "burgundy"],
      "gray": ["white", "blue", "black", "red", "navy", "khaki", "blush", "coral", "burgundy"],
    };
  }

  private static extractProductVariations(input: string) {
    const lowerInput = input.toLowerCase();
    const colorPatterns: Record<string, string[]> = {"black":["black"],"white":["white"],"navy blue":["navy blue","navy"],"blue":["blue"],"light blue":["light blue","sky blue"],"red":["red"],"burgundy":["burgundy","wine red"],"green":["green"],"olive":["olive"],"pink":["pink"],"blush":["blush"],"coral":["coral"],"yellow":["yellow"],"gold":["gold"],"cream":["cream"],"beige":["beige"],"brown":["brown"],"tan":["tan"],"khaki":["khaki"],"purple":["purple"],"gray":["gray","grey"],"charcoal":["charcoal"],"silver":["silver"],"orange":["orange"],"peach":["peach"],"rose":["rose"],"emerald":["emerald"],"teal":["teal"],"maroon":["maroon"],"caramel":["caramel"]};

    const colors: string[] = [];
    for (const [color, keywords] of Object.entries(colorPatterns)) {
      if (keywords.some(k => lowerInput.includes(k))) colors.push(color);
    }

    const sizePatterns: Record<string, string[]> = {"XS":["extra small","xs"],"S":["small"," s "],"M":["medium"," m "],"L":["large"," l "],"XL":["extra large","xl"],"XXL":["2xl","xxl","double extra large"]};
    const sizes: string[] = [];
    for (const [size, keywords] of Object.entries(sizePatterns)) {
      if (keywords.some(k => lowerInput.includes(k))) sizes.push(size);
    }

    const qualityPatterns: Record<string, string[]> = {"Standard":["standard"],"Premium":["premium","high quality","quality"],"Luxury":["luxury","premium luxury","exclusive","luxury collection"]};
    const qualities: string[] = [];
    for (const [quality, keywords] of Object.entries(qualityPatterns)) {
      if (keywords.some(k => lowerInput.includes(k))) qualities.push(quality);
    }

    const priceMatch = lowerInput.match(/\$?(\d+)\s*(?:-|to)\s*\$?(\d+)|(?:under|below|less than|max|maximum)\s*\$?(\d+)|(?:over|above|more than|min|minimum)\s*\$?(\d+)/);
    const priceRange = { min: null as number | null, max: null as number | null };
    if (priceMatch) {
      if (priceMatch[1] && priceMatch[2]) { priceRange.min = parseInt(priceMatch[1]); priceRange.max = parseInt(priceMatch[2]); }
      else if (priceMatch[3]) priceRange.max = parseInt(priceMatch[3]);
      else if (priceMatch[4]) priceRange.min = parseInt(priceMatch[4]);
    }

    const availability = !lowerInput.includes("out of stock") && !lowerInput.includes("unavailable");

    const productTypes = new Set<string>();
    const typeKeywords: Record<string, string[]> = {"laptop":["laptop","laptops","notebook","macbook","thinkpad"],"shirt":["shirt","shirts","tshirt","t-shirt"],"pant":["pant","pants","trouser","trousers","jean","jeans"],"dress":["dress","dresses","gown"],"jacket":["jacket","jackets","coat"],"shoes":["shoes","shoe","footwear","sneaker","sneakers","boot","boots","sandal","sandals","loafer","loafers","formal shoes","casual shoes","athletic shoes"]};

    for (const [type, keywords] of Object.entries(typeKeywords)) {
      for (const keyword of keywords) {
        const regex = new RegExp(`\\b${keyword}\\b`, 'i');
        if (regex.test(lowerInput)) { productTypes.add(type); break; }
      }
    }

    let advice = "";
    if (colors.length >= 2) {
      const pairings = this.getColorPairings();
      const color1 = colors[0];
      const color2 = colors[1];
      if (pairings[color1] && pairings[color1].includes(color2)) advice = `✨ ${color1.charAt(0).toUpperCase() + color1.slice(1)} and ${color2} is a perfect match! This is a classic, timeless combination.`;
      else if (pairings[color2] && pairings[color2].includes(color1)) advice = `✨ ${color2.charAt(0).toUpperCase() + color2.slice(1)} and ${color1} is a perfect match! This is a classic, timeless combination.`;
      else advice = `Great choice! ${color1.charAt(0).toUpperCase() + color1.slice(1)} and ${color2} work well together.`;
    } else if (colors.length === 1) {
      const pairings = this.getColorPairings();
      const color = colors[0];
      if (pairings[color]) {
        const recommendedList = pairings[color].slice(0, 4).join(", ");
        advice = `💡 ${color.charAt(0).toUpperCase() + color.slice(1)} pairs beautifully with ${recommendedList} - classic fashion choices!`;
      }
    }

    if (qualities.length > 0) {
      const qualityDesc = qualities[0] === "Luxury" ? "exclusive luxury" : qualities[0] === "Premium" ? "premium quality" : "excellent";
      advice += advice ? ` Perfect for ${qualityDesc} fashion!` : `✨ Looking for ${qualityDesc} fashion items!`;
    }

    if (sizes.length > 0) advice += ` Available in size ${sizes.join(", ")}!`;

    let recommendedColors: string[] = [];
    if (colors.length > 0) {
      const pairings = this.getColorPairings();
      const mentionedColor = colors[0].toLowerCase();
      if (pairings[mentionedColor]) recommendedColors = pairings[mentionedColor];
      else recommendedColors = ["white", "light blue", "gray", "navy blue", "khaki"];
    }

    return { colors, sizes, qualities, priceRange, availability, productTypes, advice, recommendedColors };
  }

  private static extractStoryProducts(input: string) {
    const variations = this.extractProductVariations(input);
    return { colors: variations.colors, productTypes: variations.productTypes, advice: variations.advice, recommendedColors: variations.recommendedColors };
  }

  private static parseIntent(input: string): SearchParams & { conversationalResponse: string; isSpecificSearch: boolean; isStoryMode: boolean } {
    const lowerInput = input.toLowerCase().trim();
    const storyKeywords = ["match", "go with", "pair with", "combine", "outfit", "which", "better", "suit", "fit", "recommend for", "i want", "i need", "looking for", "find", "show"];
    let isStoryMode = storyKeywords.some(k => lowerInput.includes(k));

    if (!isStoryMode) {
      const fashionColors = ["red","blue","green","black","white","yellow","orange","purple","pink","brown","gray","grey","navy","beige","khaki","olive","gold","silver","tan","cream","ivory","maroon","burgundy","teal","turquoise","mint","lime","coral","rose","copper","bronze"];
      const fashionTypes = ["laptop","notebook","macbook","computer","shirt","pant","pants","dress","jacket","shoe","shoes","shorts","sweater","blazer","skirt","belt","scarf","bag","hat","sunglasses","coat"];
      const hasColor = fashionColors.some(color => lowerInput.includes(color));
      const hasType = fashionTypes.some(type => lowerInput.includes(type));
      if (hasColor && hasType) isStoryMode = true;
    }

    if (isStoryMode) {
      return {
        category: null,
        productType: null,
        attributes: [],
        minPrice: null,
        maxPrice: null,
        intent: 'search',
        conversationalResponse: "Let me find the perfect items for you!",
        isSpecificSearch: false,
        isStoryMode: true
      };
    }

    const greetingKeywords = ["hello","hi","hey","greetings","good morning","good afternoon","good evening"];
    const startsWithGreeting = greetingKeywords.some(k => lowerInput.startsWith(k));
    const isOnlyGreeting = greetingKeywords.some(k => lowerInput === k || lowerInput === k + "!");
    if (isOnlyGreeting || (startsWithGreeting && lowerInput.split(" ").length <= 2)) {
      return { category: null, productType: null, attributes: [], minPrice: null, maxPrice: null, intent: 'greeting', conversationalResponse: "Welcome to SmartShop! I'm here to help you find the perfect products. What are you looking for today?", isSpecificSearch: false, isStoryMode: false };
    }

    const helpKeywords = ["help","assist","support","guide"];
    if (helpKeywords.some(k => lowerInput.includes(k)) && lowerInput.split(" ").length <= 3) {
      return { category: null, productType: null, attributes: [], minPrice: null, maxPrice: null, intent: 'help', conversationalResponse: "I can help you find fashion items by type, style, color, price range, or occasion. You can ask for deals, recommendations, or budget options!", isSpecificSearch: false, isStoryMode: false };
    }

    let intent: 'search' | 'deal' | 'recommend' | 'budget' | 'greeting' | 'help' = 'search';
    let category: string | null = null;
    let productType: string | null = null;
    const attributes: string[] = [];
    let minPrice: number | null = null;
    let maxPrice: number | null = null;
    let isSpecificSearch = false;

    const dealKeywords = ["sale","deal","discount","offer","cheap","affordable","bargain"];
    if (dealKeywords.some(k => lowerInput.includes(k))) { intent = 'deal'; isSpecificSearch = true; }

    const recommendKeywords = ["recommend","suggest","best","top","popular","rating"];
    if (recommendKeywords.some(k => lowerInput.includes(k))) { intent = 'recommend'; isSpecificSearch = false; }

    const budgetKeywords = ["budget","under","maximum","max price"];
    if (budgetKeywords.some(k => lowerInput.includes(k))) { intent = 'budget'; isSpecificSearch = true; }

    const categoryMap: Record<string, string> = {"electronic":"Electronics","gadget":"Electronics","tech":"Electronics","device":"Electronics","computer":"Electronics","cloth":"Clothing"};
    for (const [key, cat] of Object.entries(categoryMap)) { if (lowerInput.includes(key)) { category = cat; isSpecificSearch = true; break; } }

    const productTypeMap: Record<string, string[]> = {"Laptop":["laptop","laptops","notebook","notebooks","computer","pc","macbook","thinkpad","xps","spectre","zephyrus","predator","razer blade","surface laptop"],"Smartphone":["phone","smartphone","mobile","iphone","android"],"Earbuds":["earbuds","headphones","earphone","headset","airpods"],"TV":["tv","television","display","screen","monitor"],"Mouse":["mouse","mice"],"Keyboard":["keyboard","keeb"],"Watch":["watch","smartwatch","wearable"],"Blender":["blender","mixer","food processor"],"Coffee Maker":["coffee maker","coffee machine","coffee brewer","coffee"],"Microwave":["microwave","oven"],"Vacuum":["vacuum","cleaner","cleaning"],"T-Shirt":["tshirt","t-shirt","shirt"],"Jeans":["jeans","pants","trousers","denim"],"Jacket":["jacket","coat"],"Shoes":["shoes","shoe","sneaker","boots","footwear","running"],"Dress":["dress","gown"]};
    for (const [type, keywords] of Object.entries(productTypeMap)) { if (keywords.some(k => lowerInput.includes(k))) { productType = type; isSpecificSearch = true; break; } }

    const attributes_map: Record<string, string[]> = {"gaming":["gaming","gamer","game"],"wireless":["wireless","cordless"],"blue":["blue"],"black":["black"],"white":["white"],"red":["red"],"pro":["pro"],"max":["max"],"mini":["mini"],"premium":["premium","high-end","luxury"],"budget":["budget"],"affordable":["affordable"],"lightweight":["lightweight","light"],"waterproof":["waterproof","water-resistant"],"fast":["fast","speed","quick"],"silent":["silent","quiet","noise-free"],"smart":["smart","intelligent"],"professional":["professional","pro"],"compact":["compact","small"],"portable":["portable"],"durable":["durable","strong","tough"]};
    for (const [attr, keywords] of Object.entries(attributes_map)) { if (keywords.some(k => lowerInput.includes(k))) { attributes.push(attr); isSpecificSearch = true; } }

    const priceMatch = lowerInput.match(/\$?(\d+)\s*(?:-|to)\s*\$?(\d+)|(?:under|below|less than|max|maximum)\s*\$?(\d+)|(?:over|above|more than|min|minimum)\s*\$?(\d+)/);
    if (priceMatch) { if (priceMatch[1] && priceMatch[2]) { minPrice = parseInt(priceMatch[1]); maxPrice = parseInt(priceMatch[2]); } else if (priceMatch[3]) maxPrice = parseInt(priceMatch[3]); else if (priceMatch[4]) minPrice = parseInt(priceMatch[4]); isSpecificSearch = true; }

    if (!isSpecificSearch && lowerInput.trim().split(/\s+/).length > 0) isSpecificSearch = true;

    const conversationalResponse = this.generateConversationalResponse(intent, category, productType, attributes);

    return { category, productType, attributes, minPrice, maxPrice, intent, conversationalResponse, isSpecificSearch, isStoryMode: false };
  }

  private static generateConversationalResponse(intent: string, category: string | null, productType: string | null, attributes: string[]) {
    switch (intent) {
      case 'deal': return `Great! I found some amazing deals for you. Here are products with the best discounts!`;
      case 'recommend': return `Based on customer ratings, here are the best-rated ${productType ? `${productType}s` : 'products'} in our store!`;
      case 'budget': return `Perfect! Let me show you the most affordable options that match your criteria.`;
      default:
        if (productType) return `Let me find ${productType}${attributes.length > 0 ? ` that are ${attributes.join(", ")}` : ""} for you!`;
        if (category) return `Searching in ${category}${attributes.length > 0 ? ` for ${attributes.join(", ")} items` : ""}...`;
        return "Here are the products I found for you!";
    }
  }

  private static fuzzySearch(query: string, items: Product[]): Product[] {
    const keywords = this.extractKeywords(query);
    return items.filter(product => {
      const productText = `${product.name} ${product.type} ${product.brand} ${product.category} ${product.specs}`.toLowerCase();
      return keywords.some(keyword => productText.includes(keyword));
    });
  }

  public static async getResponse(input: string): Promise<AIResponse> {
    await new Promise(resolve => setTimeout(resolve, 150));
    const lowerInput = input.toLowerCase().trim();
    const wordCount = lowerInput.split(/\s+/).length;
    const greetingKeywords = ["hello","hi","hey","greetings","good morning","good afternoon","good evening"];
    const helpKeywords = ["help","assist","support"];
    const isOnlyGreeting = greetingKeywords.some(k => lowerInput === k || lowerInput === k + "!");
    const isOnlyHelp = helpKeywords.some(k => lowerInput === k || lowerInput === k + " me");

    if (isOnlyGreeting && wordCount <= 2) {
      return { text: "Welcome to SmartShop! I'm here to help you find the perfect products. What are you looking for today?", products: [], isConversationalOnly: true };
    }

    if (isOnlyHelp && wordCount <= 2) {
      return { text: "I can help you find products by name, type, brand, color, price range, or occasion. Just tell me what you're looking for!", products: [], isConversationalOnly: true };
    }

    const searchResults = searchProducts(input);
    if (searchResults.length > 0) {
      return { text: `Found ${searchResults.length} product${searchResults.length !== 1 ? 's' : ''} matching "${input}":`, products: searchResults, isConversationalOnly: false };
    }

    return { text: `Sorry, no products found matching "${input}". Try searching for: laptops, shirts, jeans, dresses, shoes, bags, jackets, or check our available brands!`, products: [], isConversationalOnly: true };
  }

  public static getProductDetails(productId: number): Product | null { return getProductById(productId) || null; }
  public static getCategories(): string[] { const categories = new Set(DB.map(p => p.category)); return Array.from(categories).sort(); }
  public static getBrandsByCategory(category: string): string[] { const brands = new Set(DB.filter(p => p.category.toLowerCase().includes(category.toLowerCase())).map(p => p.brand)); return Array.from(brands).sort(); }
}

