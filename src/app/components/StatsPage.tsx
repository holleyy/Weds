import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { BarChart3, Film, Trophy, Award, ArrowLeft, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { toast } from "sonner";
import { categories } from "../data/categories";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface Stats {
  stats: {
    [categoryId: string]: {
      [nomineeId: string]: {
        willWin: number;
        shouldWin: number;
      };
    };
  };
  totalBallots: number;
}

const API = `https://${projectId}.supabase.co/functions/v1/make-server-02e825ae`;
const HEADERS = { Authorization: `Bearer ${publicAnonKey}` };

export function StatsPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [winners, setWinners] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    Promise.allSettled([
      fetch(`${API}/stats`, { headers: HEADERS }).then((r) => r.json()),
      fetch(`${API}/winners`, { headers: HEADERS }).then((r) => r.json()),
    ])
      .then(([statsResult, winnersResult]) => {
        if (statsResult.status === "fulfilled") {
          setStats(statsResult.value);
        } else {
          toast.error("Failed to load stats");
        }
        if (winnersResult.status === "fulfilled" && winnersResult.value.winners) {
          setWinners(winnersResult.value.winners);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const getCategoryStats = (categoryId: string) => {
    if (!stats) return [];

    const categoryStats = stats.stats[categoryId] || {};
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return [];

    return category.nominees.map((nominee) => {
      const nomineeStats = categoryStats[nominee.id] || { willWin: 0, shouldWin: 0 };
      return {
        nominee,
        willWin: nomineeStats.willWin,
        shouldWin: nomineeStats.shouldWin,
        willWinPercent: stats.totalBallots > 0
          ? (nomineeStats.willWin / stats.totalBallots) * 100
          : 0,
        shouldWinPercent: stats.totalBallots > 0
          ? (nomineeStats.shouldWin / stats.totalBallots) * 100
          : 0,
      };
    }).sort((a, b) => b.willWin - a.willWin);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (!stats || stats.totalBallots === 0) {
    return (
      <div className="max-w-3xl mx-auto pb-24 sm:pb-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Statistics
          </h1>
        </div>
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <BarChart3 className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No ballots submitted yet</p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Stats will appear once people start submitting predictions
          </p>
        </div>
      </div>
    );
  }

  if (selectedCategory) {
    const category = categories.find((c) => c.id === selectedCategory);
    const categoryStats = getCategoryStats(selectedCategory);

    return (
      <div className="max-w-3xl mx-auto pb-24 sm:pb-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedCategory(null)}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          All Categories
        </Button>

        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            {category?.name}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Based on {stats.totalBallots} submitted {stats.totalBallots === 1 ? "ballot" : "ballots"}
          </p>
        </div>

        <div className="space-y-3">
          {categoryStats.map((item, index) => {
            const isWinner = winners[selectedCategory] === item.nominee.id;
            return (
            <div key={item.nominee.id} className={`rounded-xl border bg-card p-5 transition-colors ${isWinner ? "border-amber-500/50 bg-amber-500/5" : "border-border"}`}>
              <div className="flex items-start gap-3 mb-4">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isWinner ? "bg-amber-500/20" : "bg-primary/10"}`}>
                  {isWinner
                    ? <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    : <span className="text-xs font-bold text-primary">{index + 1}</span>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className={`font-semibold text-sm ${isWinner ? "text-amber-300" : "text-foreground"}`}>{item.nominee.name}</h3>
                    {isWinner && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        Winner
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Film className="w-3 h-3" />
                    {item.nominee.film}
                  </p>
                </div>
              </div>
              <div className="space-y-3 pl-9">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Trophy className="w-3 h-3 text-primary" />
                      Will Win
                    </span>
                    <span className="text-xs font-medium text-foreground">
                      {item.willWin} ({item.willWinPercent.toFixed(0)}%)
                    </span>
                  </div>
                  <Progress value={item.willWinPercent} className="h-1.5" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Award className="w-3 h-3 text-primary" />
                      Should Win
                    </span>
                    <span className="text-xs font-medium text-foreground">
                      {item.shouldWin} ({item.shouldWinPercent.toFixed(0)}%)
                    </span>
                  </div>
                  <Progress value={item.shouldWinPercent} className="h-1.5" />
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-24 sm:pb-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Statistics
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Based on {stats.totalBallots} submitted {stats.totalBallots === 1 ? "ballot" : "ballots"}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate("/ballot")}>
          My Ballot
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {categories.map((category) => {
          const categoryStats = getCategoryStats(category.id);
          const topPick = categoryStats[0];
          const winnerId = winners[category.id];
          const winnerNominee = winnerId
            ? category.nominees.find((n) => n.id === winnerId)
            : null;

          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`text-left rounded-xl border bg-card p-5 transition-all hover:bg-card/80 ${
                winnerNominee
                  ? "border-amber-500/40 hover:border-amber-500/60"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                <Award className="w-4 h-4 text-primary" />
                {category.name}
              </h3>
              {winnerNominee ? (
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-amber-400/80 mb-1 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> Winner
                  </p>
                  <p className="text-sm font-semibold text-amber-300">{winnerNominee.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Film className="w-3 h-3" />
                    {winnerNominee.film}
                  </p>
                </div>
              ) : topPick && topPick.willWin > 0 ? (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Leading prediction</p>
                  <p className="text-sm font-medium text-foreground">{topPick.nominee.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Film className="w-3 h-3" />
                    {topPick.nominee.film}
                  </p>
                  <div className="mt-2.5">
                    <Progress value={topPick.willWinPercent} className="h-1" />
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {topPick.willWinPercent.toFixed(0)}% ({topPick.willWin} votes)
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground/60">No votes yet</p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
