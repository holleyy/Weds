import { categories } from "../data/categories";
import { films } from "../data/films";

export interface FilmCategoryInfo {
  filmId: string;
  filmTitle: string;
  categories: {
    id: string;
    name: string;
  }[];
}

// Create a mapping from film titles to film IDs from our films.ts data
const filmTitleToIdMap = new Map<string, string>();
films.forEach(film => {
  // Map both the exact title and normalized version
  filmTitleToIdMap.set(film.title.toLowerCase(), film.id);
  filmTitleToIdMap.set(film.title, film.id);
});

// Helper function to normalize film titles (remove country suffixes for international films)
function normalizeFilmTitle(filmTitle: string): string {
  // Remove country suffix pattern like " (Brazil)", " (France)", " (Norway)", etc.
  return filmTitle.replace(/\s*\([A-Z][a-z]+\)\s*$/, '').trim();
}

// Helper function to find film ID from title
function getFilmIdFromTitle(filmTitle: string): string | null {
  // First, normalize the title to remove country suffixes
  const normalizedTitle = normalizeFilmTitle(filmTitle);
  
  // Try exact match with normalized title
  if (filmTitleToIdMap.has(normalizedTitle)) {
    return filmTitleToIdMap.get(normalizedTitle)!;
  }
  
  // Try lowercase match with normalized title
  if (filmTitleToIdMap.has(normalizedTitle.toLowerCase())) {
    return filmTitleToIdMap.get(normalizedTitle.toLowerCase())!;
  }
  
  // Try original title without normalization
  if (filmTitleToIdMap.has(filmTitle)) {
    return filmTitleToIdMap.get(filmTitle)!;
  }
  
  if (filmTitleToIdMap.has(filmTitle.toLowerCase())) {
    return filmTitleToIdMap.get(filmTitle.toLowerCase())!;
  }
  
  // Fallback: generate ID from normalized title
  return normalizedTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// Map films to their nominated categories
export function getFilmCategories(): Map<string, FilmCategoryInfo> {
  const filmMap = new Map<string, FilmCategoryInfo>();

  categories.forEach((category) => {
    category.nominees.forEach((nominee) => {
      const filmId = getFilmIdFromTitle(nominee.film);
      
      if (!filmId) return;
      
      if (!filmMap.has(filmId)) {
        filmMap.set(filmId, {
          filmId,
          filmTitle: nominee.film,
          categories: [],
        });
      }

      const filmInfo = filmMap.get(filmId)!;
      // Check if category already exists to avoid duplicates
      if (!filmInfo.categories.some(c => c.id === category.id)) {
        filmInfo.categories.push({
          id: category.id,
          name: category.name,
        });
      }
    });
  });

  return filmMap;
}

// Get all unique categories that have film nominations
export function getAllFilmCategories() {
  return categories.map(cat => ({
    id: cat.id,
    name: cat.name,
  }));
}

// Get films for a specific category
export function getFilmsForCategory(categoryId: string): string[] {
  const category = categories.find(c => c.id === categoryId);
  if (!category) return [];

  const filmIds = new Set<string>();
  category.nominees.forEach(nominee => {
    const filmId = getFilmIdFromTitle(nominee.film);
    if (filmId) {
      filmIds.add(filmId);
    }
  });

  return Array.from(filmIds);
}

// Check how many nominees in a category have been seen
export function getSeenNomineesForCategory(
  categoryId: string,
  filmLog: Record<string, { seen: boolean }>
): { seen: number; total: number } {
  const category = categories.find(c => c.id === categoryId);
  if (!category) return { seen: 0, total: 0 };

  let seen = 0;
  const total = category.nominees.length;

  category.nominees.forEach(nominee => {
    const filmId = getFilmIdFromTitle(nominee.film);
    if (filmId && filmLog[filmId]?.seen) {
      seen++;
    }
  });

  return { seen, total };
}