import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Film,
  Award,
  Vote,
  Users,
  BarChart3,
  Check,
  Trophy,
  Eye,
  ChevronLeft,
  ChevronRight,
  Pencil,
  CircleMinus,
} from "lucide-react";
import { Button } from "./ui/button";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { toast } from "sonner";
import { categories, Category } from "../data/categories";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { getSeenNomineesForCategory } from "../utils/filmCategories";

interface BallotPicks {
  [categoryId: string]: {
    willWin: string;
    shouldWin: string;
  };
}

interface FilmLog {
  [filmId: string]: {
    seen: boolean;
    rating?: number;
  };
}

export function BallotPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"overview" | "edit">("overview");
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [picks, setPicks] = useState<BallotPicks>({});
  const [filmLog, setFilmLog] = useState<FilmLog>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const currentCategory = categories[currentCategoryIndex];
  const completedCount = Object.keys(picks).filter(
    (k) => picks[k]?.willWin && picks[k]?.shouldWin
  ).length;
  const progress = (completedCount / categories.length) * 100;

  useEffect(() => {
    loadBallot();
    loadFilmLog();
  }, []);

  const loadBallot = async () => {
    const storedUser = localStorage.getItem("oscarUser");
    if (!storedUser) {
      navigate("/");
      return;
    }

    const user = JSON.parse(storedUser);
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-02e825ae/ballot/${user.userId}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();

      if (data.ballot) {
        setPicks(data.ballot.ballot || {});
        setIsSubmitted(data.ballot.isSubmitted || false);
      }
    } catch (error) {
      console.error("Error loading ballot:", error);
      toast.error("Failed to load your ballot");
    } finally {
      setIsLoading(false);
    }
  };

  const loadFilmLog = async () => {
    const storedUser = localStorage.getItem("oscarUser");
    if (!storedUser) return;

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
    }
  };

  const saveBallot = async (isSubmitting = false) => {
    const storedUser = localStorage.getItem("oscarUser");
    if (!storedUser) return;

    const user = JSON.parse(storedUser);
    setIsSaving(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-02e825ae/ballot/save`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            userId: user.userId,
            ballot: picks,
            isSubmitted: isSubmitting,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save ballot");
      }

      if (isSubmitting) {
        setIsSubmitted(true);
        toast.success("Ballot submitted successfully!");
        setMode("overview");
      } else {
        toast.success("Progress saved!");
      }
    } catch (error) {
      console.error("Error saving ballot:", error);
      toast.error("Failed to save ballot");
    } finally {
      setIsSaving(false);
    }
  };

  const handleWillWinChange = (nomineeId: string) => {
    setPicks({
      ...picks,
      [currentCategory.id]: {
        willWin: nomineeId,
        shouldWin: picks[currentCategory.id]?.shouldWin || "",
      },
    });
  };

  const handleShouldWinChange = (nomineeId: string) => {
    setPicks({
      ...picks,
      [currentCategory.id]: {
        willWin: picks[currentCategory.id]?.willWin || "",
        shouldWin: nomineeId,
      },
    });
  };

  const handleNext = () => {
    if (currentCategoryIndex < categories.length - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
      saveBallot(false);
    }
  };

  const handlePrevious = () => {
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(currentCategoryIndex - 1);
    }
  };

  const handleSubmit = () => {
    const allCategoriesFilled = categories.every((cat) => {
      const categoryPicks = picks[cat.id];
      return categoryPicks?.willWin && categoryPicks?.shouldWin;
    });

    if (!allCategoriesFilled) {
      toast.error("Please complete all categories before submitting");
      return;
    }

    saveBallot(true);
  };

  const enterEditMode = (categoryIndex?: number) => {
    if (categoryIndex !== undefined) {
      setCurrentCategoryIndex(categoryIndex);
    }
    setMode("edit");
  };

  const exitEditMode = () => {
    saveBallot(false);
    setMode("overview");
  };

  const getNomineeName = (categoryId: string, nomineeId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    const nominee = category?.nominees.find((n) => n.id === nomineeId);
    return nominee ? { name: nominee.name, film: nominee.film } : null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading your ballot...</p>
        </div>
      </div>
    );
  }

  // ─── Overview Mode ──────────────────────────────────────────────────
  if (mode === "overview") {
    return (
      <div className="max-w-3xl mx-auto pb-28 sm:pb-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Your Ballot
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                {completedCount} of {categories.length} categories completed
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/view-ballots")}
                className="gap-2"
              >
                <Users className="w-3.5 h-3.5" />
                View Ballots
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/stats")}
                className="gap-2"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                Stats
              </Button>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-4">
            <Progress value={progress} className="h-1" />
          </div>
        </div>

        {isSubmitted && (
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3.5 mb-6 flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-400">Ballot Submitted</p>
              <p className="text-xs text-emerald-400/60">
                You can still edit your picks until the ceremony starts.
              </p>
            </div>
          </div>
        )}

        {/* Category List */}
        <div className="space-y-3">
          {categories.map((category, index) => {
            const categoryPicks = picks[category.id];
            const willWinNominee = categoryPicks?.willWin
              ? getNomineeName(category.id, categoryPicks.willWin)
              : null;
            const shouldWinNominee = categoryPicks?.shouldWin
              ? getNomineeName(category.id, categoryPicks.shouldWin)
              : null;
            const isComplete = categoryPicks?.willWin && categoryPicks?.shouldWin;
            const isEmpty = !categoryPicks?.willWin && !categoryPicks?.shouldWin;

            return (
              <button
                key={category.id}
                onClick={() => enterEditMode(index)}
                className="w-full text-left rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-primary/20 group"
              >
                {/* Category Header */}
                <div className="px-4 py-3 border-b border-border/50 bg-muted/20 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Award className="w-4 h-4 text-primary" />
                    {category.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    {isComplete && (
                      <span className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <Check className="w-3 h-3 text-emerald-400" />
                      </span>
                    )}
                    <Pencil className="w-3.5 h-3.5 text-muted-foreground/0 group-hover:text-muted-foreground transition-colors" />
                  </div>
                </div>

                {/* Picks */}
                {isEmpty ? (
                  <div className="px-4 py-4 flex items-center gap-2.5">
                    <CircleMinus className="w-4 h-4 text-muted-foreground/30" />
                    <p className="text-sm text-muted-foreground/60 italic">
                      No picks yet — tap to choose
                    </p>
                  </div>
                ) : (
                  <div className="px-4 py-3 grid sm:grid-cols-2 gap-3">
                    {/* Will Win */}
                    <div className="flex items-start gap-2.5">
                      <Trophy className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
                          Will Win
                        </p>
                        {willWinNominee ? (
                          <>
                            <p className="text-sm font-medium text-foreground truncate">
                              {willWinNominee.name}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
                              <Film className="w-3 h-3 flex-shrink-0" />
                              {willWinNominee.film}
                            </p>
                          </>
                        ) : (
                          <p className="text-xs text-muted-foreground/50 italic">Not selected</p>
                        )}
                      </div>
                    </div>

                    {/* Should Win */}
                    <div className="flex items-start gap-2.5">
                      <Vote className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
                          Should Win
                        </p>
                        {shouldWinNominee ? (
                          <>
                            <p className="text-sm font-medium text-foreground truncate">
                              {shouldWinNominee.name}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
                              <Film className="w-3 h-3 flex-shrink-0" />
                              {shouldWinNominee.film}
                            </p>
                          </>
                        ) : (
                          <p className="text-xs text-muted-foreground/50 italic">Not selected</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Floating Edit Button */}
        <div className="fixed bottom-20 sm:bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-2">
          <Button
            onClick={() => enterEditMode(0)}
            size="sm"
            className="shadow-lg shadow-primary/20 gap-2 rounded-full px-5"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit Ballot
          </Button>
          {completedCount === categories.length && !isSubmitted && (
            <Button
              onClick={handleSubmit}
              disabled={isSaving}
              size="sm"
              className="shadow-lg bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-5 gap-2"
            >
              <Check className="w-3.5 h-3.5" />
              Submit
            </Button>
          )}
        </div>
      </div>
    );
  }

  // ─── Edit Mode ──────────────────────────────────────────────────────
  const currentPicks = picks[currentCategory.id] || { willWin: "", shouldWin: "" };

  return (
    <div className="max-w-3xl mx-auto pb-24 sm:pb-8">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={exitEditMode}
          className="gap-1.5"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Overview
        </Button>
        <div className="hidden sm:flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/view-ballots")}
            className="gap-2"
          >
            <Users className="w-3.5 h-3.5" />
            Ballots
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/stats")}
            className="gap-2"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Stats
          </Button>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground font-medium">
            {completedCount} of {categories.length} categories
          </span>
          <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-1" />
      </div>

      {/* Category Card */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Category Header */}
        <div className="px-5 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-primary flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-foreground truncate">
                {currentCategory.name}
              </h2>
              <p className="text-xs text-muted-foreground">
                Category {currentCategoryIndex + 1} of {categories.length}
              </p>
            </div>
          </div>
          {/* Film viewing stats */}
          {(() => {
            const seenStats = getSeenNomineesForCategory(currentCategory.id, filmLog);
            if (seenStats.total > 0) {
              return (
                <div className="mt-3 flex items-center gap-2 text-xs">
                  <Eye className="w-3.5 h-3.5 text-primary/70" />
                  <span className="text-muted-foreground">
                    Seen{" "}
                    <span className="text-foreground font-medium">{seenStats.seen}</span> of{" "}
                    <span className="text-foreground font-medium">{seenStats.total}</span>{" "}
                    {seenStats.total === 1 ? "nominee" : "nominees"}
                  </span>
                  {seenStats.seen < seenStats.total && (
                    <button
                      onClick={() => navigate("/film-log")}
                      className="text-primary/70 hover:text-primary transition-colors"
                    >
                      Update film log
                    </button>
                  )}
                </div>
              );
            }
            return null;
          })()}
        </div>

        <div className="p-5 space-y-8">
          {/* Will Win */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-primary" />
              Will Win
            </h3>
            <RadioGroup
              value={currentPicks.willWin}
              onValueChange={handleWillWinChange}
            >
              <div className="space-y-2">
                {currentCategory.nominees.map((nominee) => {
                  const isSelected = currentPicks.willWin === nominee.id;
                  return (
                    <div
                      key={nominee.id}
                      className={`flex items-center gap-3 p-3.5 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? "border-primary/40 bg-primary/5"
                          : "border-border hover:border-border hover:bg-muted/30"
                      }`}
                    >
                      <RadioGroupItem value={nominee.id} id={`will-${nominee.id}`} />
                      <Label
                        htmlFor={`will-${nominee.id}`}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="font-medium text-foreground text-sm">
                          {nominee.name}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Film className="w-3 h-3" />
                          {nominee.film}
                        </div>
                      </Label>
                    </div>
                  );
                })}
              </div>
            </RadioGroup>
          </div>

          {/* Should Win */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <Vote className="w-4 h-4 text-primary" />
              Should Win
            </h3>
            <RadioGroup
              value={currentPicks.shouldWin}
              onValueChange={handleShouldWinChange}
            >
              <div className="space-y-2">
                {currentCategory.nominees.map((nominee) => {
                  const isSelected = currentPicks.shouldWin === nominee.id;
                  return (
                    <div
                      key={nominee.id}
                      className={`flex items-center gap-3 p-3.5 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? "border-primary/40 bg-primary/5"
                          : "border-border hover:border-border hover:bg-muted/30"
                      }`}
                    >
                      <RadioGroupItem
                        value={nominee.id}
                        id={`should-${nominee.id}`}
                      />
                      <Label
                        htmlFor={`should-${nominee.id}`}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="font-medium text-foreground text-sm">
                          {nominee.name}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Film className="w-3 h-3" />
                          {nominee.film}
                        </div>
                      </Label>
                    </div>
                  );
                })}
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-5 gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={currentCategoryIndex === 0}
          className="gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => saveBallot(false)}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>

          {currentCategoryIndex === categories.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={isSaving}
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Submit Ballot
            </Button>
          ) : (
            <Button onClick={handleNext} size="sm" className="gap-1">
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Category Navigator */}
      <div className="mt-8 hidden sm:block">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Jump to category
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
          {categories.map((cat, index) => {
            const isComplete = picks[cat.id]?.willWin && picks[cat.id]?.shouldWin;
            const isCurrent = currentCategoryIndex === index;
            return (
              <button
                key={cat.id}
                onClick={() => setCurrentCategoryIndex(index)}
                className={`px-3 py-2 text-left rounded-lg border text-xs transition-all ${
                  isCurrent
                    ? "border-primary/40 bg-primary/5 text-foreground"
                    : isComplete
                    ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
                    : "border-border text-muted-foreground hover:bg-muted/30"
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="font-medium truncate">{cat.name}</span>
                  {isComplete && (
                    <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
