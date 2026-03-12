import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Users, Film, Award, Vote, ArrowLeft, Trophy } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { categories } from "../data/categories";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface Ballot {
  userId: string;
  username: string;
  ballot: {
    [categoryId: string]: {
      willWin: string;
      shouldWin: string;
    };
  };
  isSubmitted: boolean;
  updatedAt: string;
}

export function ViewBallotsPage() {
  const navigate = useNavigate();
  const [ballots, setBallots] = useState<Ballot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBallot, setSelectedBallot] = useState<Ballot | null>(null);

  useEffect(() => {
    loadBallots();
  }, []);

  const loadBallots = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-02e825ae/ballots/submitted`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();

      if (data.ballots) {
        setBallots(data.ballots);
      }
    } catch (error) {
      console.error("Error loading ballots:", error);
      toast.error("Failed to load ballots");
    } finally {
      setIsLoading(false);
    }
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
          <p className="text-sm text-muted-foreground">Loading ballots...</p>
        </div>
      </div>
    );
  }

  if (selectedBallot) {
    return (
      <div className="max-w-3xl mx-auto pb-24 sm:pb-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedBallot(null)}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </Button>

        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            {selectedBallot.username}'s Ballot
          </h1>
        </div>

        <div className="space-y-3">
          {categories.map((category) => {
            const picks = selectedBallot.ballot[category.id];
            if (!picks) return null;

            const willWinNominee = getNomineeName(category.id, picks.willWin);
            const shouldWinNominee = getNomineeName(category.id, picks.shouldWin);

            return (
              <div key={category.id} className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="px-4 py-3 border-b border-border bg-muted/30">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Award className="w-4 h-4 text-primary" />
                    {category.name}
                  </h3>
                </div>
                <div className="p-4 grid sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2.5">
                    <Trophy className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Will Win</p>
                      <p className="text-sm font-medium text-foreground">
                        {willWinNominee?.name}
                      </p>
                      {willWinNominee && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Film className="w-3 h-3" />
                          {willWinNominee.film}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Vote className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Should Win</p>
                      <p className="text-sm font-medium text-foreground">
                        {shouldWinNominee?.name}
                      </p>
                      {shouldWinNominee && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Film className="w-3 h-3" />
                          {shouldWinNominee.film}
                        </p>
                      )}
                    </div>
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
            <Users className="w-5 h-5 text-primary" />
            Submitted Ballots
          </h1>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate("/ballot")}>
          My Ballot
        </Button>
      </div>

      {ballots.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <Users className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No ballots submitted yet</p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Be the first to submit your predictions!
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {ballots.map((ballot) => {
            const completedCategories = Object.keys(ballot.ballot).filter(
              (catId) => {
                const picks = ballot.ballot[catId];
                return picks.willWin && picks.shouldWin;
              }
            ).length;

            return (
              <button
                key={ballot.userId}
                onClick={() => setSelectedBallot(ballot)}
                className="text-left rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:bg-card/80"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {ballot.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground">{ballot.username}</h3>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Categories</span>
                    <span className="text-foreground font-medium">
                      {completedCategories} / {categories.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="text-emerald-400 font-medium">Submitted</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
