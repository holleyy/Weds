import { useState } from "react";
import { useNavigate } from "react-router";
import { Trophy } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "sonner";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export function AuthPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", pin: "" });
  const [signupData, setSignupData] = useState({ username: "", pin: "", confirmPin: "" });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-02e825ae/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(loginData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Login failed");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("oscarUser", JSON.stringify({
        userId: data.userId,
        username: data.username,
        isAdmin: data.isAdmin || false,
      }));

      toast.success("Welcome back!");
      navigate(data.isAdmin ? "/admin" : "/home");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signupData.pin !== signupData.confirmPin) {
      toast.error("PINs do not match");
      return;
    }

    if (signupData.pin.length < 4) {
      toast.error("PIN must be at least 4 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-02e825ae/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            username: signupData.username,
            pin: signupData.pin,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Signup failed");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("oscarUser", JSON.stringify({
        userId: data.userId,
        username: data.username,
      }));

      toast.success("Account created successfully!");
      navigate("/home");
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-5">
            <Trophy className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
            Oscars Sweepstakes
          </h1>
          <p className="text-sm text-muted-foreground">
            98th Academy Awards Predictions
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <div className="rounded-xl border border-border bg-card p-6">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="login-username" className="text-sm text-muted-foreground">
                    Username
                  </Label>
                  <Input
                    id="login-username"
                    type="text"
                    placeholder="Enter your username"
                    value={loginData.username}
                    onChange={(e) =>
                      setLoginData({ ...loginData, username: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-pin" className="text-sm text-muted-foreground">
                    PIN
                  </Label>
                  <Input
                    id="login-pin"
                    type="password"
                    placeholder="Enter your PIN"
                    value={loginData.pin}
                    onChange={(e) =>
                      setLoginData({ ...loginData, pin: e.target.value })
                    }
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </div>
          </TabsContent>

          <TabsContent value="signup">
            <div className="rounded-xl border border-border bg-card p-6">
              <form onSubmit={handleSignup} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="signup-username" className="text-sm text-muted-foreground">
                    Username
                  </Label>
                  <Input
                    id="signup-username"
                    type="text"
                    placeholder="Choose a username"
                    value={signupData.username}
                    onChange={(e) =>
                      setSignupData({ ...signupData, username: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-pin" className="text-sm text-muted-foreground">
                    PIN
                  </Label>
                  <Input
                    id="signup-pin"
                    type="password"
                    placeholder="Create a PIN (min 4 characters)"
                    value={signupData.pin}
                    onChange={(e) =>
                      setSignupData({ ...signupData, pin: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-pin" className="text-sm text-muted-foreground">
                    Confirm PIN
                  </Label>
                  <Input
                    id="signup-confirm-pin"
                    type="password"
                    placeholder="Confirm your PIN"
                    value={signupData.confirmPin}
                    onChange={(e) =>
                      setSignupData({ ...signupData, confirmPin: e.target.value })
                    }
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
