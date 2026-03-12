import { useNavigate } from "react-router";
import { Trophy, Vote, Users, BarChart3, Film, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export function HomePage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("oscarUser");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUsername(user.username);
    }
  }, []);

  const actions = [
    {
      title: "Your Ballot",
      description: "Create or edit your Oscar predictions",
      icon: Vote,
      path: "/ballot",
      accent: true,
    },
    {
      title: "Film Log",
      description: "Track which nominated films you've watched",
      icon: Film,
      path: "/film-log",
      accent: true,
    },
    {
      title: "View Ballots",
      description: "See predictions from other participants",
      icon: Users,
      path: "/view-ballots",
      accent: false,
    },
    {
      title: "Statistics",
      description: "See how everyone is voting across categories",
      icon: BarChart3,
      path: "/stats",
      accent: false,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto pb-24 sm:pb-8">
      {/* Welcome */}
      <div className="mb-10">
        <p className="text-xs uppercase tracking-widest text-primary mb-2 font-medium">
          98th Academy Awards
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Welcome, {username}
        </h1>
      </div>

      {/* Action Grid */}
      <div className="grid gap-3 sm:grid-cols-2 mb-10">
        {actions.map(({ title, description, icon: Icon, path, accent }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="group text-left rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:bg-card/80"
          >
            <div className="flex items-start gap-4">
              <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                accent ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground mb-0.5 group-hover:text-primary transition-colors">
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* How it works */}
      <div className="rounded-xl border border-border bg-card/50 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">How it works</h3>
        </div>
        <ul className="text-sm text-muted-foreground space-y-1.5 leading-relaxed">
          <li className="flex items-start gap-2">
            <span className="text-primary/60 mt-0.5">1.</span>
            Pick your predictions for each category
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary/60 mt-0.5">2.</span>
            Choose who you think <span className="text-foreground font-medium">will win</span> and who <span className="text-foreground font-medium">should win</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary/60 mt-0.5">3.</span>
            Save your progress anytime, submit when ready
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary/60 mt-0.5">4.</span>
            Compare your picks with friends and see live stats
          </li>
        </ul>
      </div>
    </div>
  );
}
