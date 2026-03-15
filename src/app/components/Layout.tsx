import { Outlet, useNavigate, useLocation } from "react-router";
import { Trophy, Users, BarChart3, LogOut, Vote, Film, Shield } from "lucide-react";
import { useEffect, useState } from "react";

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<{ userId: string; username: string; isAdmin?: boolean } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("oscarUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else if (location.pathname !== "/") {
      navigate("/");
    }
  }, [navigate, location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("oscarUser");
    setUser(null);
    navigate("/");
  };

  const handleHeaderClick = () => {
    if (user && location.pathname !== "/home") {
      navigate("/home");
    }
  };

  const isAuthPage = location.pathname === "/";

  const navItems = user?.isAdmin
    ? [{ path: "/admin", icon: Shield, label: "Admin" }]
    : [
        { path: "/ballot", icon: Vote, label: "Ballot" },
        { path: "/film-log", icon: Film, label: "Films" },
        { path: "/view-ballots", icon: Users, label: "Ballots" },
        { path: "/stats", icon: BarChart3, label: "Stats" },
      ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {!isAuthPage && user && (
        <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              <button
                onClick={handleHeaderClick}
                className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
              >
                <Trophy className="w-6 h-6 text-primary" />
                <span className="text-lg font-semibold tracking-tight text-foreground">
                  Oscars <span className="text-primary">Sweepstakes</span>
                </span>
              </button>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground hidden sm:inline tracking-wide uppercase">
                  {user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1.5"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Outlet />
      </main>

      {!isAuthPage && user && (
        <nav className="fixed bottom-0 left-0 right-0 border-t border-border/50 bg-background/90 backdrop-blur-xl sm:hidden z-50">
          <div className="flex items-center justify-around h-14 max-w-md mx-auto">
            {navItems.map(({ path, icon: Icon, label }) => {
              const isActive = location.pathname === path;
              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className={`flex flex-col items-center gap-0.5 px-4 py-1.5 transition-colors ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium tracking-wide">{label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
