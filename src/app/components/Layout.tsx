import { Outlet, useNavigate, useLocation } from "react-router";
import { Trophy, Users, BarChart3, LogOut, Vote, Film, Shield, LogIn } from "lucide-react";
import { useEffect, useState } from "react";

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<{ userId: string; username: string; isAdmin?: boolean } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("oscarUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("oscarUser");
    setUser(null);
    navigate("/");
  };

  const isLoginPage = location.pathname === "/login";

  const navItems = user?.isAdmin
    ? [{ path: "/admin", icon: Shield, label: "Admin" }]
    : user
    ? [
        { path: "/ballot", icon: Vote, label: "Ballot" },
        { path: "/film-log", icon: Film, label: "Films" },
        { path: "/view-ballots", icon: Users, label: "Ballots" },
        { path: "/stats", icon: BarChart3, label: "Stats" },
      ]
    : [
        { path: "/film-log", icon: Film, label: "Films" },
        { path: "/view-ballots", icon: Users, label: "Ballots" },
        { path: "/stats", icon: BarChart3, label: "Stats" },
      ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {!isLoginPage && (
        <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
              >
                <Trophy className="w-6 h-6 text-primary" />
                <span className="text-lg font-semibold tracking-tight text-foreground">
                  Oscars <span className="text-primary">Sweepstakes</span>
                </span>
              </button>
              <div className="flex items-center gap-3">
                {user ? (
                  <>
                    <span className="text-xs text-muted-foreground hidden sm:inline tracking-wide uppercase">
                      {user.username}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="text-muted-foreground hover:text-foreground transition-colors p-1.5"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => navigate("/login")}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-muted"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Outlet />
      </main>

      {!isLoginPage && (
        <nav className="fixed bottom-0 left-0 right-0 border-t border-border/50 bg-background/90 backdrop-blur-xl sm:hidden z-50">
          <div className="flex items-center justify-around h-14 max-w-md mx-auto">
            {navItems.map(({ path, icon: Icon, label }) => {
              const isActive = location.pathname === path;
              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className={`flex flex-col items-center gap-0.5 px-4 py-1.5 transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium tracking-wide">{label}</span>
                </button>
              );
            })}
            {!user && (
              <button
                onClick={() => navigate("/login")}
                className={`flex flex-col items-center gap-0.5 px-4 py-1.5 transition-colors ${
                  isLoginPage ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <LogIn className="w-5 h-5" />
                <span className="text-[10px] font-medium tracking-wide">Sign In</span>
              </button>
            )}
          </div>
        </nav>
      )}
    </div>
  );
}
