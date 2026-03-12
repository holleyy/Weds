import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Film as FilmIcon, Check, Star, Eye, EyeOff, Search, Award, Filter, Save, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { films } from "../data/films";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { getFilmCategories, getAllFilmCategories, getFilmsForCategory } from "../utils/filmCategories";

interface FilmLog {
  [filmId: string]: {
    seen: boolean;
    rating?: number;
  };
}

interface FilmData {
  id: string;
  title: string;
  imdbId?: string;
  year?: string;
  poster?: string;
  rating?: number;
  letterboxdRating?: number;
  categories: { id: string; name: string }[];
}

export function FilmLogPage() {
  const navigate = useNavigate();
  const [filmLog, setFilmLog] = useState<FilmLog>({});
  const [filmsData, setFilmsData] = useState<FilmData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "seen" | "unseen">("all");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryFilterOpen, setCategoryFilterOpen] = useState(false);

  const filmCategoryMap = getFilmCategories();
  const allCategories = getAllFilmCategories();

  useEffect(() => {
    loadFilmLog();
    loadFilmData();
  }, []);

  const loadFilmLog = async () => {
    const storedUser = localStorage.getItem("oscarUser");
    if (!storedUser) {
      navigate("/");
      return;
    }

    const user = JSON.parse(storedUser);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-02e825ae/film-log/${user.userId}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();

      if (data.filmLog) {
        setFilmLog(data.filmLog || {});
      }
    } catch (error) {
      console.error("Error loading film log:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFilmData = async () => {
    const enrichedFilms = films.map(film => {
      const categoryInfo = filmCategoryMap.get(film.id);
      return {
        ...film,
        year: "2025",
        rating: Math.random() * 2 + 6.5,
        letterboxdRating: Math.random() * 1.5 + 3,
        categories: categoryInfo?.categories || [],
      };
    });

    setFilmsData(enrichedFilms);
  };

  const saveFilmLog = async () => {
    const storedUser = localStorage.getItem("oscarUser");
    if (!storedUser) return;

    const user = JSON.parse(storedUser);
    setIsSaving(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-02e825ae/film-log/save`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            userId: user.userId,
            filmLog: filmLog,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save film log");
      }

      toast.success("Film log saved!");
    } catch (error) {
      console.error("Error saving film log:", error);
      toast.error("Failed to save film log");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleFilmSeen = (filmId: string) => {
    setFilmLog(prev => ({
      ...prev,
      [filmId]: {
        seen: !prev[filmId]?.seen,
        rating: prev[filmId]?.rating,
      },
    }));
  };

  const getCategoryStats = (categoryId: string) => {
    const filmsInCategory = getFilmsForCategory(categoryId);
    const seen = filmsInCategory.filter(filmId => filmLog[filmId]?.seen).length;
    return { seen, total: filmsInCategory.length };
  };

  const filteredFilms = filmsData
    .filter(film => {
      const matchesSearch = film.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        filter === "all" ||
        (filter === "seen" && filmLog[film.id]?.seen) ||
        (filter === "unseen" && !filmLog[film.id]?.seen);
      const matchesCategory =
        !selectedCategory ||
        film.categories.some(cat => cat.id === selectedCategory);
      return matchesSearch && matchesFilter && matchesCategory;
    })
    .sort((a, b) => a.title.localeCompare(b.title));

  const seenCount = Object.values(filmLog).filter(log => log.seen).length;
  const totalFilms = films.length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading film log...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-24 sm:pb-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <FilmIcon className="w-5 h-5 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Film Log</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Track which nominated films you've watched
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Watched</p>
              <p className="text-xl font-bold text-foreground">
                {seenCount}<span className="text-sm font-normal text-muted-foreground">/{totalFilms}</span>
              </p>
            </div>
            <Eye className="w-5 h-5 text-primary/60" />
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Progress</p>
              <p className="text-xl font-bold text-foreground">
                {totalFilms > 0 ? Math.round((seenCount / totalFilms) * 100) : 0}%
              </p>
            </div>
            <FilmIcon className="w-5 h-5 text-primary/60" />
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Remaining</p>
              <p className="text-xl font-bold text-foreground">
                {totalFilms - seenCount}
              </p>
            </div>
            <EyeOff className="w-5 h-5 text-muted-foreground/40" />
          </div>
        </div>
      </div>

      {/* Category Stats Banner */}
      {selectedCategory && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3.5 mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Award className="w-4 h-4 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">
                {allCategories.find(c => c.id === selectedCategory)?.name}
              </p>
              <p className="text-xs text-muted-foreground">
                Watched {getCategoryStats(selectedCategory).seen} of {getCategoryStats(selectedCategory).total} films
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedCategory(null)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear
          </button>
        </div>
      )}

      {/* Search & Filters */}
      <div className="rounded-xl border border-border bg-card p-4 mb-5 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search films..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-1.5">
            {(["all", "seen", "unseen"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filter === f
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <button
            onClick={() => setCategoryFilterOpen(!categoryFilterOpen)}
            className="flex items-center gap-2 w-full sm:cursor-default"
          >
            <Filter className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Filter by category</span>
            {selectedCategory && (
              <span className="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                1 active
              </span>
            )}
            <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground ml-auto transition-transform sm:hidden ${categoryFilterOpen ? "rotate-180" : ""}`} />
          </button>
          <div className={`flex-wrap gap-1.5 mt-2 ${categoryFilterOpen ? "flex" : "hidden sm:flex"}`}>
            {allCategories.map(category => {
              const stats = getCategoryStats(category.id);
              const isSelected = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(isSelected ? null : category.id)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {category.name} ({stats.seen}/{stats.total})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Film List */}
      <div className="space-y-2 mb-6">
        {filteredFilms.map((film) => {
          const isSeen = filmLog[film.id]?.seen;
          return (
            <button
              key={film.id}
              onClick={() => toggleFilmSeen(film.id)}
              className={`w-full text-left rounded-xl border p-4 transition-all ${
                isSeen
                  ? "border-emerald-500/20 bg-emerald-500/5"
                  : "border-border bg-card hover:bg-muted/30"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    isSeen
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-muted text-muted-foreground/40"
                  }`}
                >
                  <Check className={`w-4 h-4 ${isSeen ? "opacity-100" : "opacity-30"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`font-medium text-sm ${isSeen ? "text-foreground" : "text-foreground/80"}`}>
                      {film.title}
                    </h3>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
                      isSeen
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {isSeen ? "Watched" : "Unseen"}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    {film.letterboxdRating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-primary fill-primary" />
                        <span className="text-xs text-muted-foreground font-medium">
                          {film.letterboxdRating.toFixed(1)}
                        </span>
                      </div>
                    )}
                    {film.imdbId && (
                      <a
                        href={`https://letterboxd.com/imdb/${film.imdbId}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[11px] text-primary/70 hover:text-primary transition-colors"
                      >
                        Letterboxd
                      </a>
                    )}
                  </div>
                  {/* Category Pills */}
                  {film.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {film.categories.map(cat => (
                        <span
                          key={cat.id}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-primary/8 text-primary/70 border border-primary/10"
                        >
                          <Award className="w-2.5 h-2.5" />
                          {cat.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {filteredFilms.length === 0 && (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <FilmIcon className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No films found</p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Try adjusting your search or filter
          </p>
        </div>
      )}

      {/* Save FAB */}
      <div className="fixed bottom-20 sm:bottom-8 right-4 sm:right-8">
        <Button
          onClick={saveFilmLog}
          disabled={isSaving}
          size="sm"
          className="shadow-lg shadow-primary/20 gap-2"
        >
          <Save className="w-3.5 h-3.5" />
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}