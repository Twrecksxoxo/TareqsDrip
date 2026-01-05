import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';

// ============ PRODUCT DETAIL ANALYSIS UTILITIES ============

// Extract colors from product name/description
function extractColors(text) {
  const colorKeywords = {
    "black": ["black", "noir", "ebony", "charcoal", "onyx"],
    "white": ["white", "ivory", "cream", "pearl", "snow"],
    "red": ["red", "crimson", "scarlet", "burgundy", "maroon", "wine", "cherry", "ruby"],
    "blue": ["blue", "navy", "azure", "cobalt", "sapphire", "indigo", "teal", "cyan", "turquoise", "aqua"],
    "green": ["green", "olive", "emerald", "mint", "sage", "forest", "lime", "khaki"],
    "pink": ["pink", "rose", "blush", "coral", "salmon", "fuchsia", "magenta"],
    "yellow": ["yellow", "gold", "golden", "mustard", "amber", "honey", "lemon"],
    "orange": ["orange", "tangerine", "peach", "apricot", "rust"],
    "purple": ["purple", "violet", "lavender", "plum", "mauve", "lilac"],
    "brown": ["brown", "tan", "beige", "camel", "chocolate", "coffee", "mocha", "taupe"],
    "gray": ["gray", "grey", "silver", "slate", "ash", "charcoal"],
  };

  const lowerText = text.toLowerCase();
  const foundColors = [];

  for (const [color, keywords] of Object.entries(colorKeywords)) {
    if (keywords.some(k => lowerText.includes(k))) {
      foundColors.push(color);
    }
  }
  return foundColors;
}

// Extract materials from product description
function extractMaterials(text) {
  const materialKeywords = [
    "cotton", "silk", "wool", "leather", "suede", "denim", "polyester", "nylon",
    "linen", "cashmere", "velvet", "satin", "chiffon", "canvas", "tweed", "fleece",
    "mesh", "knit", "lace", "jersey", "rayon", "spandex", "lycra", "corduroy"
  ];

  const lowerText = text.toLowerCase();
  return materialKeywords.filter(m => lowerText.includes(m));
}

// Extract styles/occasions from product description
function extractStyles(text) {
  const styleKeywords = {
    "casual": ["casual", "everyday", "relaxed", "comfortable", "laid-back", "weekend"],
    "formal": ["formal", "business", "office", "professional", "work", "elegant", "sophisticated"],
    "party": ["party", "evening", "cocktail", "night out", "glamorous", "festive"],
    "sporty": ["sporty", "athletic", "gym", "workout", "fitness", "active", "running", "training"],
    "vintage": ["vintage", "retro", "classic", "timeless", "old-school"],
    "trendy": ["trendy", "fashion", "stylish", "chic", "modern", "contemporary"],
    "bohemian": ["bohemian", "boho", "hippie", "free-spirited"],
    "minimalist": ["minimalist", "simple", "basic", "clean", "understated"],
    "luxury": ["luxury", "premium", "high-end", "designer", "exclusive", "luxurious"]
  };

  const lowerText = text.toLowerCase();
  const foundStyles = [];

  for (const [style, keywords] of Object.entries(styleKeywords)) {
    if (keywords.some(k => lowerText.includes(k))) {
      foundStyles.push(style);
    }
  }
  return foundStyles;
}

// Extract size information
function extractSizes(text) {
  const sizePatterns = ["xxs", "xs", "s", "m", "l", "xl", "xxl", "xxxl", "2xl", "3xl", "4xl",
    "small", "medium", "large", "extra large", "one size", "free size"];
  const lowerText = text.toLowerCase();
  return sizePatterns.filter(s => lowerText.includes(s));
}

// Extract product type/category
function extractProductTypes(text) {
  const productTypes = {
    "tops": ["shirt", "blouse", "top", "t-shirt", "tee", "polo", "tank", "camisole", "sweater", "hoodie", "sweatshirt", "cardigan", "crop top"],
    "bottoms": ["pants", "jeans", "trousers", "shorts", "skirt", "leggings", "culottes", "joggers", "chinos"],
    "dresses": ["dress", "gown", "maxi", "midi", "mini dress", "sundress", "bodycon", "wrap dress"],
    "outerwear": ["jacket", "coat", "blazer", "cardigan", "vest", "parka", "windbreaker", "bomber"],
    "footwear": ["shoes", "boots", "sneakers", "heels", "sandals", "loafers", "flats", "pumps", "wedges", "slides", "flip-flops"],
    "bags": ["bag", "handbag", "purse", "tote", "backpack", "clutch", "crossbody", "shoulder bag", "satchel", "messenger"],
    "accessories": ["scarf", "belt", "hat", "cap", "sunglasses", "watch", "jewelry", "necklace", "bracelet", "earrings", "ring"],
  };

  const lowerText = text.toLowerCase();
  const foundTypes = [];

  for (const [type, keywords] of Object.entries(productTypes)) {
    if (keywords.some(k => lowerText.includes(k))) {
      foundTypes.push(type);
    }
  }
  return foundTypes;
}

// Extract price-related keywords
function extractPriceIntent(text) {
  const lowerText = text.toLowerCase();

  if (lowerText.match(/under\s*\$?\d+|below\s*\$?\d+|less than\s*\$?\d+|max\s*\$?\d+|budget/)) {
    return "budget";
  }
  if (lowerText.match(/over\s*\$?\d+|above\s*\$?\d+|more than\s*\$?\d+|premium|luxury|expensive/)) {
    return "premium";
  }
  if (lowerText.match(/cheap|affordable|inexpensive|economical|value/)) {
    return "budget";
  }
  if (lowerText.match(/deal|discount|sale|offer|bargain/)) {
    return "deal";
  }
  return null;
}

// Extract price range from user input
function extractPriceRange(text) {
  const lowerText = text.toLowerCase();
  const priceRange = { min: null, max: null };

  // Match patterns like "$50 to $100" or "50-100"
  const rangeMatch = lowerText.match(/\$?(\d+)\s*(?:to|-)\s*\$?(\d+)/);
  if (rangeMatch) {
    priceRange.min = parseInt(rangeMatch[1]);
    priceRange.max = parseInt(rangeMatch[2]);
  }

  // Match "under $X" or "below $X"
  const underMatch = lowerText.match(/(?:under|below|less than|max|maximum)\s*\$?(\d+)/);
  if (underMatch) {
    priceRange.max = parseInt(underMatch[1]);
  }

  // Match "over $X" or "above $X"
  const overMatch = lowerText.match(/(?:over|above|more than|min|minimum)\s*\$?(\d+)/);
  if (overMatch) {
    priceRange.min = parseInt(overMatch[1]);
  }

  return priceRange;
}

// Analyze product and score based on criteria
function analyzeProduct(product, criteria) {
  const fullText = `${product.name} ${product.description} ${product.category}`.toLowerCase();

  let score = 0;
  const matchDetails = [];

  // Extract product attributes
  const productColors = extractColors(fullText);
  const productMaterials = extractMaterials(fullText);
  const productStyles = extractStyles(fullText);
  const productTypes = extractProductTypes(fullText);

  // ============ NAME MATCHING (High Priority) ============
  // Direct name match - very important for specific product searches
  if (criteria.keywords && criteria.keywords.length > 0) {
    const productNameLower = product.name.toLowerCase();
    const productDescLower = (product.description || '').toLowerCase();

    // Exact phrase match in name (highest priority)
    if (criteria.originalQuery && productNameLower.includes(criteria.originalQuery.toLowerCase())) {
      score += 50;
      matchDetails.push(`Name matches "${criteria.originalQuery}"`);
    }

    // Individual keyword matches in name
    const nameMatches = criteria.keywords.filter(k => productNameLower.includes(k.toLowerCase()));
    if (nameMatches.length > 0) {
      score += nameMatches.length * 20;
      if (!matchDetails.some(d => d.startsWith('Name'))) {
        matchDetails.push(`Name: ${nameMatches.slice(0, 3).join(', ')}`);
      }
    }

    // Keyword matches in description
    const descMatches = criteria.keywords.filter(k => productDescLower.includes(k.toLowerCase()));
    score += descMatches.length * 8;
  }

  // ============ PRICE ANALYSIS (High Priority) ============
  const productPrice = product.price;

  // Exact price match or close match
  if (criteria.exactPrice) {
    const priceDiff = Math.abs(productPrice - criteria.exactPrice);
    if (priceDiff === 0) {
      score += 40;
      matchDetails.push(`Exact price: $${productPrice}`);
    } else if (priceDiff <= criteria.exactPrice * 0.1) {
      score += 25;
      matchDetails.push(`Price ~$${productPrice}`);
    }
  }

  // Price range matching
  if (criteria.priceRange) {
    const { min, max } = criteria.priceRange;
    if (min !== null && max !== null && productPrice >= min && productPrice <= max) {
      score += 30;
      matchDetails.push(`Price $${productPrice} (in $${min}-$${max})`);
    } else if (max !== null && productPrice <= max) {
      score += 25;
      matchDetails.push(`Price $${productPrice} (under $${max})`);
    } else if (min !== null && productPrice >= min) {
      score += 20;
      matchDetails.push(`Price $${productPrice} (above $${min})`);
    }
  }

  // Budget/Premium intent
  if (criteria.priceIntent === "budget") {
    if (productPrice < 50) {
      score += 20;
      matchDetails.push(`Budget-friendly: $${productPrice}`);
    } else if (productPrice < 100) {
      score += 10;
      matchDetails.push(`Affordable: $${productPrice}`);
    }
  }
  if (criteria.priceIntent === "premium" && productPrice > 200) {
    score += 15;
    matchDetails.push(`Premium: $${productPrice}`);
  }

  // Deal/Discount detection
  if (product.mrp > productPrice) {
    const discount = Math.round(((product.mrp - productPrice) / product.mrp) * 100);
    if (criteria.priceIntent === "deal" || discount >= 10) {
      score += Math.min(discount, 30);
      matchDetails.push(`${discount}% off (was $${product.mrp})`);
    }
  }

  // ============ RATING ANALYSIS (High Priority) ============
  const rating = product.avgRating ? parseFloat(product.avgRating) : null;

  // Rating criteria from user query
  if (criteria.minRating && rating) {
    if (rating >= criteria.minRating) {
      score += 25;
      matchDetails.push(`Rating: ${rating}⭐`);
    }
  } else if (criteria.wantsHighRated && rating) {
    // User asked for "best", "top rated", "highly rated"
    if (rating >= 4.5) {
      score += 30;
      matchDetails.push(`Top rated: ${rating}⭐`);
    } else if (rating >= 4.0) {
      score += 20;
      matchDetails.push(`Highly rated: ${rating}⭐`);
    } else if (rating >= 3.5) {
      score += 10;
      matchDetails.push(`Good rating: ${rating}⭐`);
    }
  } else if (rating) {
    // Default rating bonus
    if (rating >= 4.5) score += 15;
    else if (rating >= 4.0) score += 10;
    else if (rating >= 3.5) score += 5;
  }

  // Review count / popularity
  if (product.reviewCount > 20) {
    score += 15;
    matchDetails.push(`Popular (${product.reviewCount} reviews)`);
  } else if (product.reviewCount > 10) {
    score += 10;
  } else if (product.reviewCount > 5) {
    score += 5;
  }

  // ============ COLOR MATCHING ============
  if (criteria.colors && criteria.colors.length > 0) {
    const colorMatches = criteria.colors.filter(c => productColors.includes(c));
    if (colorMatches.length > 0) {
      score += colorMatches.length * 25;
      matchDetails.push(`Color: ${colorMatches.join(', ')}`);
    }
  }

  // ============ MATERIAL MATCHING ============
  if (criteria.materials && criteria.materials.length > 0) {
    const materialMatches = criteria.materials.filter(m => productMaterials.includes(m));
    if (materialMatches.length > 0) {
      score += materialMatches.length * 20;
      matchDetails.push(`Material: ${materialMatches.join(', ')}`);
    }
  }

  // ============ STYLE/OCCASION MATCHING ============
  if (criteria.styles && criteria.styles.length > 0) {
    const styleMatches = criteria.styles.filter(s => productStyles.includes(s));
    if (styleMatches.length > 0) {
      score += styleMatches.length * 20;
      matchDetails.push(`Style: ${styleMatches.join(', ')}`);
    }
  }

  // ============ PRODUCT TYPE MATCHING ============
  if (criteria.productTypes && criteria.productTypes.length > 0) {
    const typeMatches = criteria.productTypes.filter(t => productTypes.includes(t));
    if (typeMatches.length > 0) {
      score += typeMatches.length * 30;
      matchDetails.push(`Type: ${typeMatches.join(', ')}`);
    }
  }

  // ============ CATEGORY MATCHING ============
  if (criteria.category && product.category) {
    if (product.category.toLowerCase().includes(criteria.category.toLowerCase())) {
      score += 20;
      matchDetails.push(`Category: ${product.category}`);
    }
  }

  return {
    ...product,
    score,
    matchDetails,
    extractedColors: productColors,
    extractedStyles: productStyles,
    extractedTypes: productTypes,
    extractedMaterials: productMaterials
  };
}

// Parse user input and extract search criteria
function parseUserIntent(input) {
  const lowerInput = input.toLowerCase();

  // Extract all relevant details from user query
  const colors = extractColors(lowerInput);
  const materials = extractMaterials(lowerInput);
  const styles = extractStyles(lowerInput);
  const productTypes = extractProductTypes(lowerInput);
  const priceRange = extractPriceRange(lowerInput);
  const priceIntent = extractPriceIntent(lowerInput);

  // ============ RATING EXTRACTION ============
  let minRating = null;
  let wantsHighRated = false;

  // Check for rating requirements like "4 star", "rated above 4", etc.
  const ratingMatch = lowerInput.match(/(\d+(?:\.\d+)?)\s*(?:star|stars|rating|rated)/);
  if (ratingMatch) {
    minRating = parseFloat(ratingMatch[1]);
  }

  // Check for "above X rating" or "rating above X"
  const ratingAboveMatch = lowerInput.match(/(?:above|over|at least|minimum)\s*(\d+(?:\.\d+)?)\s*(?:star|stars|rating)?/);
  if (ratingAboveMatch) {
    minRating = parseFloat(ratingAboveMatch[1]);
  }

  // Check for qualitative rating requests
  const highRatedKeywords = ["best", "top rated", "highly rated", "highest rated", "best rated", "popular", "most popular", "top", "excellent"];
  if (highRatedKeywords.some(k => lowerInput.includes(k))) {
    wantsHighRated = true;
  }

  // ============ EXACT PRICE EXTRACTION ============
  let exactPrice = null;

  // Match exact price like "$50", "50 dollars", "priced at 50"
  const exactPriceMatch = lowerInput.match(/(?:exactly|priced at|costs?|for)\s*\$?(\d+(?:\.\d{2})?)/);
  if (exactPriceMatch) {
    exactPrice = parseFloat(exactPriceMatch[1]);
  }

  // Match standalone price mention like "$50 bag"
  const standalonePriceMatch = lowerInput.match(/\$(\d+(?:\.\d{2})?)/);
  if (!exactPrice && standalonePriceMatch) {
    exactPrice = parseFloat(standalonePriceMatch[1]);
  }

  // ============ CATEGORY EXTRACTION ============
  let category = null;
  const categoryKeywords = {
    "bags": ["bag", "bags", "handbag", "purse", "tote", "backpack", "clutch"],
    "clothing": ["clothing", "clothes", "apparel", "wear", "outfit"],
    "shoes": ["shoes", "shoe", "footwear", "sneakers", "boots", "heels", "sandals"],
    "accessories": ["accessories", "accessory", "jewelry", "watch", "belt", "scarf"],
    "electronics": ["electronics", "electronic", "gadget", "device", "tech"]
  };

  for (const [cat, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(k => lowerInput.includes(k))) {
      category = cat;
      break;
    }
  }

  // Extract meaningful keywords (removing common words)
  const commonWords = ["the", "a", "an", "is", "are", "i", "want", "need", "looking", "for",
    "find", "show", "me", "some", "any", "please", "can", "you", "get", "have", "with",
    "and", "or", "in", "on", "at", "to", "of", "that", "this", "it", "what", "which",
    "best", "top", "good", "great", "nice", "rated", "rating", "star", "stars", "price",
    "priced", "under", "over", "above", "below", "dollar", "dollars"];

  const keywords = lowerInput
    .split(/[\s,;.!?-]+/)
    .filter(word => word.length > 2 && !commonWords.includes(word));

  return {
    colors,
    materials,
    styles,
    productTypes,
    priceRange,
    priceIntent,
    keywords,
    originalQuery: input,
    minRating,
    wantsHighRated,
    exactPrice,
    category
  };
}

// Generate intelligent response based on search results
function generateSmartResponse(criteria, results) {
  const parts = [];

  // Product type
  if (criteria.productTypes.length > 0) {
    parts.push(`${criteria.productTypes.join(', ')}`);
  }

  // Category
  if (criteria.category) {
    parts.push(`in ${criteria.category}`);
  }

  // Colors
  if (criteria.colors.length > 0) {
    parts.push(`in ${criteria.colors.join(' or ')}`);
  }

  // Styles
  if (criteria.styles.length > 0) {
    parts.push(`for ${criteria.styles.join(' or ')} style`);
  }

  // Materials
  if (criteria.materials.length > 0) {
    parts.push(`made of ${criteria.materials.join(' or ')}`);
  }

  // Price criteria
  if (criteria.exactPrice) {
    parts.push(`around $${criteria.exactPrice}`);
  } else if (criteria.priceRange.min && criteria.priceRange.max) {
    parts.push(`priced $${criteria.priceRange.min}-$${criteria.priceRange.max}`);
  } else if (criteria.priceRange.max) {
    parts.push(`under $${criteria.priceRange.max}`);
  } else if (criteria.priceRange.min) {
    parts.push(`over $${criteria.priceRange.min}`);
  } else if (criteria.priceIntent === "budget") {
    parts.push(`budget-friendly`);
  } else if (criteria.priceIntent === "deal") {
    parts.push(`with great deals`);
  }

  // Rating criteria
  if (criteria.minRating) {
    parts.push(`rated ${criteria.minRating}+ stars`);
  } else if (criteria.wantsHighRated) {
    parts.push(`top rated`);
  }

  const criteriaDesc = parts.length > 0 ? parts.join(', ') : 'your search';

  if (results.length === 0) {
    return `😕 I couldn't find products matching ${criteriaDesc}. Let me show you some alternatives.`;
  }

  // Build response based on number of results
  let response = '';

  if (results.length === 1) {
    response = `🎯 Found exactly 1 product matching ${criteriaDesc}:`;
  } else if (results.length <= 3) {
    response = `🔍 Found ${results.length} products matching ${criteriaDesc}:`;
  } else {
    response = `🔍 Found ${results.length} products matching ${criteriaDesc}. Here are the best matches:`;
  }

  // Add match quality summary for top products
  const topMatches = results.slice(0, 3);
  const matchSummary = [];

  topMatches.forEach((product, idx) => {
    if (product.matchDetails && product.matchDetails.length > 0) {
      const details = product.matchDetails.slice(0, 2).join(', ');
      matchSummary.push(`${idx + 1}. ${product.name.slice(0, 25)}${product.name.length > 25 ? '...' : ''}: ${details}`);
    }
  });

  if (matchSummary.length > 0 && results.length > 1) {
    response += `\n\n📊 Top matches:\n${matchSummary.join('\n')}`;
  }

  return response;
}

// ============ DATABASE FUNCTIONS ============

// Search products from database with intelligent analysis
async function searchProducts(query) {
  const criteria = parseUserIntent(query);

  try {
    // Build dynamic search conditions
    const searchConditions = [];

    // Always search by the original query
    searchConditions.push(
      { name: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
      { category: { contains: query, mode: 'insensitive' } }
    );

    // Add keyword-based searches
    criteria.keywords.forEach(keyword => {
      if (keyword.length > 2) {
        searchConditions.push(
          { name: { contains: keyword, mode: 'insensitive' } },
          { description: { contains: keyword, mode: 'insensitive' } }
        );
      }
    });

    // Get products with expanded search
    const products = await prisma.product.findMany({
      where: {
        inStock: true,
        store: { isActive: true, status: 'approved' },
        OR: searchConditions,
      },
      include: {
        rating: {
          select: { rating: true, review: true },
        },
        store: {
          select: { name: true, username: true },
        },
      },
      take: 50, // Get more for analysis, then filter
      orderBy: { createdAt: 'desc' },
    });

    // Analyze and score each product
    const analyzedProducts = products.map(p => {
      const avgRating = p.rating.length > 0
        ? (p.rating.reduce((sum, r) => sum + r.rating, 0) / p.rating.length).toFixed(1)
        : null;

      return analyzeProduct({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        mrp: p.mrp,
        images: p.images,
        category: p.category,
        inStock: p.inStock,
        storeName: p.store?.name || 'Unknown Store',
        storeUsername: p.store?.username,
        avgRating,
        reviewCount: p.rating.length,
        reviews: p.rating.map(r => r.review).filter(Boolean).slice(0, 3)
      }, criteria);
    });

    // Sort by score and return top results
    const sortedProducts = analyzedProducts
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    return {
      products: sortedProducts.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        mrp: p.mrp,
        images: p.images,
        category: p.category,
        inStock: p.inStock,
        storeName: p.storeName,
        storeUsername: p.storeUsername,
        rating: p.avgRating,
        reviewCount: p.reviewCount,
        matchScore: p.score,
        matchDetails: p.matchDetails
      })),
      criteria,
      responseText: generateSmartResponse(criteria, sortedProducts)
    };
  } catch (error) {
    console.error('Search error:', error);
    return { products: [], criteria, responseText: 'An error occurred while searching.' };
  }
}

// Get featured/recommended products with smart analysis
async function getFeaturedProducts(limit = 5, criteria = null) {
  try {
    const products = await prisma.product.findMany({
      where: {
        inStock: true,
        store: { isActive: true, status: 'approved' },
      },
      include: {
        rating: { select: { rating: true, review: true } },
        store: { select: { name: true, username: true } },
      },
      take: 30, // Get more for analysis
      orderBy: { createdAt: 'desc' },
    });

    // If criteria provided, analyze and score products
    if (criteria) {
      const analyzedProducts = products.map(p => {
        const avgRating = p.rating.length > 0
          ? (p.rating.reduce((sum, r) => sum + r.rating, 0) / p.rating.length).toFixed(1)
          : null;

        return analyzeProduct({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          mrp: p.mrp,
          images: p.images,
          category: p.category,
          storeName: p.store?.name || 'Unknown Store',
          storeUsername: p.store?.username,
          avgRating,
          reviewCount: p.rating.length,
        }, criteria);
      });

      return analyzedProducts
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          mrp: p.mrp,
          images: p.images,
          category: p.category,
          storeName: p.storeName,
          storeUsername: p.storeUsername,
          rating: p.avgRating,
          reviewCount: p.reviewCount,
        }));
    }

    // Default: return products sorted by rating and popularity
    return products
      .map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        mrp: p.mrp,
        images: p.images,
        category: p.category,
        storeName: p.store?.name || 'Unknown Store',
        storeUsername: p.store?.username,
        rating: p.rating.length > 0
          ? (p.rating.reduce((sum, r) => sum + r.rating, 0) / p.rating.length).toFixed(1)
          : null,
        reviewCount: p.rating.length,
        // Score by rating and reviews for default sorting
        sortScore: (p.rating.length > 0
          ? (p.rating.reduce((sum, r) => sum + r.rating, 0) / p.rating.length) * 10
          : 0) + Math.min(p.rating.length, 20)
      }))
      .sort((a, b) => b.sortScore - a.sortScore)
      .slice(0, limit);
  } catch (error) {
    console.error('Featured products error:', error);
    return [];
  }
}

// Get products by category with analysis
async function getProductsByCategory(category, additionalCriteria = null) {
  try {
    const products = await prisma.product.findMany({
      where: {
        inStock: true,
        store: { isActive: true, status: 'approved' },
        category: { contains: category, mode: 'insensitive' },
      },
      include: {
        rating: { select: { rating: true, review: true } },
        store: { select: { name: true, username: true } },
      },
      take: 20,
      orderBy: { createdAt: 'desc' },
    });

    // Apply analysis if additional criteria provided
    if (additionalCriteria) {
      const analyzedProducts = products.map(p => {
        const avgRating = p.rating.length > 0
          ? (p.rating.reduce((sum, r) => sum + r.rating, 0) / p.rating.length).toFixed(1)
          : null;

        return analyzeProduct({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          mrp: p.mrp,
          images: p.images,
          category: p.category,
          storeName: p.store?.name || 'Unknown Store',
          storeUsername: p.store?.username,
          avgRating,
          reviewCount: p.rating.length,
        }, additionalCriteria);
      });

      return analyzedProducts
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
        .map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          mrp: p.mrp,
          images: p.images,
          category: p.category,
          storeName: p.storeName,
          storeUsername: p.storeUsername,
          rating: p.avgRating,
          reviewCount: p.reviewCount,
        }));
    }

    return products.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      mrp: p.mrp,
      images: p.images,
      category: p.category,
      storeName: p.store?.name || 'Unknown Store',
      storeUsername: p.store?.username,
      rating: p.rating.length > 0
        ? (p.rating.reduce((sum, r) => sum + r.rating, 0) / p.rating.length).toFixed(1)
        : null,
      reviewCount: p.rating.length,
    })).slice(0, 10);
  } catch (error) {
    console.error('Category search error:', error);
    return [];
  }
}

// AI Response generator
async function getAIResponse(input) {
  const lowerInput = input.toLowerCase().trim();

  // Handle greetings
  const greetings = ["hello", "hi", "hey", "greetings", "good morning", "good afternoon", "good evening"];
  if (greetings.some(g => lowerInput === g || lowerInput === g + "!" || lowerInput.startsWith(g + " "))) {
    const featured = await getFeaturedProducts(3);
    return {
      text: "👋 Welcome to Tareqs Drip! I'm Drip Finder, your shopping assistant. I can help you find products, check categories, or answer questions about our store. What are you looking for today?",
      products: featured,
      isConversationalOnly: featured.length === 0
    };
  }

  // Handle help requests
  const helpKeywords = ["help", "assist", "support", "what can you do", "how does this work"];
  if (helpKeywords.some(k => lowerInput.includes(k))) {
    return {
      text: "🛍️ I can help you with:\n• Finding products by name or description\n• Browsing categories (bags, clothing, accessories, etc.)\n• Checking product availability\n• Getting recommendations\n\nJust type what you're looking for!",
      products: [],
      isConversationalOnly: true
    };
  }

  // Handle thank you
  if (lowerInput.includes("thank") || lowerInput.includes("thanks")) {
    return {
      text: "You're welcome! 😊 Feel free to ask if you need anything else. Happy shopping!",
      products: [],
      isConversationalOnly: true
    };
  }

  // Handle goodbye
  if (lowerInput === "bye" || lowerInput === "goodbye" || lowerInput.includes("see you")) {
    return {
      text: "Goodbye! 👋 Thanks for visiting Tareqs Drip. Come back soon!",
      products: [],
      isConversationalOnly: true
    };
  }

  // Handle category browsing with additional criteria extraction
  const categories = ["bags", "bag", "clothing", "clothes", "accessories", "shoes", "jewelry", "watches", "electronics"];
  const matchedCategory = categories.find(cat => lowerInput.includes(cat));
  if (matchedCategory) {
    // Extract any additional criteria (colors, styles, etc.)
    const additionalCriteria = parseUserIntent(input);
    const categoryProducts = await getProductsByCategory(matchedCategory, additionalCriteria);

    if (categoryProducts.length > 0) {
      let responseText = `🏷️ Here are some ${matchedCategory} we have available`;

      // Add detail about filters applied
      if (additionalCriteria.colors.length > 0) {
        responseText += ` in ${additionalCriteria.colors.join(' or ')}`;
      }
      if (additionalCriteria.styles.length > 0) {
        responseText += ` for ${additionalCriteria.styles.join(' or ')} occasions`;
      }
      responseText += ':';

      return {
        text: responseText,
        products: categoryProducts,
        isConversationalOnly: false
      };
    }
  }

  // Handle recommendation requests with smart analysis
  if (lowerInput.includes("recommend") || lowerInput.includes("suggestion") || lowerInput.includes("popular") || lowerInput.includes("best") || lowerInput.includes("trending")) {
    // Extract any preferences from the query
    const criteria = parseUserIntent(input);
    const featured = await getFeaturedProducts(6, criteria.colors.length > 0 || criteria.styles.length > 0 ? criteria : null);

    if (featured.length > 0) {
      let responseText = "⭐ Here are our top recommended products";

      if (criteria.colors.length > 0) {
        responseText += ` in ${criteria.colors.join(' or ')}`;
      }
      if (criteria.styles.length > 0) {
        responseText += ` for ${criteria.styles.join(' or ')} style`;
      }
      if (criteria.productTypes.length > 0) {
        responseText += ` (${criteria.productTypes.join(', ')})`;
      }
      responseText += ':';

      return {
        text: responseText,
        products: featured,
        isConversationalOnly: false
      };
    }
  }

  // Handle deal/discount requests with smart sorting
  if (lowerInput.includes("deal") || lowerInput.includes("discount") || lowerInput.includes("sale") || lowerInput.includes("offer") || lowerInput.includes("cheap") || lowerInput.includes("budget") || lowerInput.includes("affordable")) {
    const criteria = parseUserIntent(input);
    criteria.priceIntent = "deal"; // Force deal intent

    const products = await getFeaturedProducts(10, criteria);
    const discounted = products.filter(p => p.mrp > p.price);
    const budgetFriendly = products.filter(p => p.price < 100);

    const resultProducts = discounted.length > 0 ? discounted : budgetFriendly.length > 0 ? budgetFriendly : products;

    if (resultProducts.length > 0) {
      let responseText = "💰 Here are some great deals";

      if (criteria.colors.length > 0) {
        responseText += ` in ${criteria.colors.join(' or ')}`;
      }
      if (criteria.productTypes.length > 0) {
        responseText += ` for ${criteria.productTypes.join(', ')}`;
      }
      responseText += ':';

      return {
        text: responseText,
        products: resultProducts.slice(0, 6),
        isConversationalOnly: false
      };
    }
  }

  // Handle price inquiries
  if (lowerInput.includes("price") || lowerInput.includes("cost") || lowerInput.includes("how much")) {
    return {
      text: "💵 To check prices, just search for the product you're interested in and I'll show you all the details including pricing!",
      products: [],
      isConversationalOnly: true
    };
  }

  // Handle shipping/delivery questions
  if (lowerInput.includes("shipping") || lowerInput.includes("delivery") || lowerInput.includes("deliver")) {
    return {
      text: "🚚 We offer reliable shipping on all orders! Delivery times vary by location. You can check specific delivery details at checkout.",
      products: [],
      isConversationalOnly: true
    };
  }

  // Handle return/refund questions
  if (lowerInput.includes("return") || lowerInput.includes("refund") || lowerInput.includes("exchange")) {
    return {
      text: "↩️ We have a customer-friendly return policy. If you're not satisfied with your purchase, please contact the store directly for return and refund options.",
      products: [],
      isConversationalOnly: true
    };
  }

  // Use intelligent product search with comprehensive analysis
  const searchResult = await searchProducts(input);

  if (searchResult.products.length > 0) {
    // Build a detailed response based on what was analyzed
    let detailedResponse = searchResult.responseText;

    // Add styling tips if colors were mentioned
    if (searchResult.criteria.colors.length > 0) {
      const colorTips = getColorStylingTips(searchResult.criteria.colors);
      if (colorTips) {
        detailedResponse += `\n\n💡 Style tip: ${colorTips}`;
      }
    }

    return {
      text: detailedResponse,
      products: searchResult.products,
      isConversationalOnly: false,
      searchCriteria: searchResult.criteria // Include for debugging/transparency
    };
  }

  // No results - suggest alternatives based on what user was looking for
  const featured = await getFeaturedProducts(5);

  // Build helpful suggestion based on user's criteria
  let suggestion = `😕 I couldn't find an exact match for "${input}".`;

  if (searchResult.criteria.colors.length > 0) {
    suggestion += ` We might not have ${searchResult.criteria.colors.join(' or ')} items right now.`;
  }
  if (searchResult.criteria.productTypes.length > 0) {
    suggestion += ` Try browsing our ${searchResult.criteria.productTypes.join(', ')} collection.`;
  }

  suggestion += "\n\nHere are some items you might like:";

  return {
    text: suggestion,
    products: featured,
    isConversationalOnly: featured.length === 0
  };
}

// Helper function for color styling tips
function getColorStylingTips(colors) {
  const colorPairings = {
    "black": "Black is versatile! Pairs well with white, cream, gold accents, or bold colors like red.",
    "white": "White is classic! Goes great with navy, black, pastels, or denim blues.",
    "red": "Red makes a statement! Pair with black, white, or navy for a bold look.",
    "blue": "Blue is timeless! Works with white, cream, tan, or coral accents.",
    "navy": "Navy is sophisticated! Complements white, cream, camel, or burgundy.",
    "green": "Green is fresh! Pairs beautifully with white, cream, tan, or gold.",
    "pink": "Pink is feminine! Looks great with gray, white, navy, or burgundy.",
    "brown": "Brown is earthy! Complements cream, white, olive, or burgundy.",
    "gray": "Gray is neutral! Works with almost anything - pink, blue, yellow, or black.",
    "beige": "Beige is elegant! Pairs with white, brown, navy, or soft pastels."
  };

  for (const color of colors) {
    if (colorPairings[color]) {
      return colorPairings[color];
    }
  }
  return null;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const response = await getAIResponse(message);
    return NextResponse.json(response);
  } catch (err) {
    console.error('Chat API error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
