import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Shield, Trophy, Save } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { categories } from "../data/categories";
import { projectId, publicAnonKey } from "/utils/supabase/info";

const API = `https://${projectId}.supabase.co/functions/v1/make-server-02e825ae`;
const HEADERS = { "Content-Type": "application/json", Authorization: `Bearer ${publicAnonKey}` };

export function AdminPage() {
  const navigate = useNavigate();
  const [winners, setWinners] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("oscarUser") || "null");
    if (!user?.isAdmin) {
      navigate("/");
      return;
    }

    fetch(`${API}/winners`, { headers: HEADERS })
      .then((r) => r.json())
      .then((data) => setWinners(data.winners || {}))
      .catch(() => toast.error("Failed to load existing winners"))
      .finally(() => setIsLoading(false));
  }, [navigate]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`${API}/winners`, {
        method: "POST",
        headers: HEADERS,
        body: JSON.stringify({ username: "Admin", pin: "Winner", winners }),
      });
      if (!response.ok) throw new Error();
      toast.success("Winners saved!");
    } catch {
      toast.error("Failed to save winners");
    } finally {
      setIsSaving(false);
    }
  };

  const setWinner = (categoryId: string, nomineeId: string) => {
    setWinners((prev) => ({ ...prev, [categoryId]: nomineeId }));
  };

  const clearWinner = (categoryId: string) => {
    setWinners((prev) => {
      const next = { ...prev };
      delete next[categoryId];
      return next;
    });
  };

  const totalSet = Object.keys(winners).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin — Set Winners</h1>
          <p className="text-sm text-muted-foreground">
            {totalSet} of {categories.length} categories set
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-muted rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${(totalSet / categories.length) * 100}%` }}
        />
      </div>

      {/* Categories */}
      <div className="space-y-6">
        {categories.map((category) => {
          const selectedWinner = winners[category.id];
          return (
            <div key={category.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h2 className="font-semibold text-base">{category.name}</h2>
                {selectedWinner && (
                  <button
                    onClick={() => clearWinner(category.id)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {category.nominees.map((nominee) => {
                  const isSelected = selectedWinner === nominee.id;
                  return (
                    <button
                      key={nominee.id}
                      onClick={() => setWinner(category.id, nominee.id)}
                      className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all ${
                        isSelected
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border bg-background hover:border-border/80 hover:bg-muted/30 text-muted-foreground"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
                          isSelected ? "border-primary" : "border-muted-foreground/40"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className={`text-sm font-medium ${isSelected ? "text-foreground" : ""}`}>
                          {nominee.name}
                        </span>
                        {nominee.film !== nominee.name && (
                          <span className="text-xs text-muted-foreground ml-2">
                            {nominee.film}
                          </span>
                        )}
                      </div>
                      {isSelected && (
                        <Trophy className="w-4 h-4 text-primary ml-auto shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky save button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-xl border-t border-border/50">
        <div className="max-w-2xl mx-auto">
          <Button onClick={handleSave} disabled={isSaving} className="w-full">
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : `Save Winners (${totalSet}/${categories.length})`}
          </Button>
        </div>
      </div>
    </div>
  );
}
