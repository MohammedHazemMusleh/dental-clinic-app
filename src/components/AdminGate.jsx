import { useState, useEffect } from "react";
import { Lock, Loader2, LogOut, Eye, EyeOff } from "lucide-react";
import { supabase } from "../supabaseClient";

const AdminGate = ({ children }) => {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);
    if (error) {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (checking) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#F7F5F1" }}
      >
        <Loader2
          size={24}
          className="animate-spin"
          style={{ color: "#1F6F6B" }}
        />
      </div>
    );
  }

  if (!session) {
    return (
      <div
        dir="rtl"
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: "#F7F5F1", fontFamily: "'Tajawal', sans-serif" }}
      >
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8"
        >
          <div
            className="flex items-center justify-center rounded-full mx-auto mb-4"
            style={{
              width: 56,
              height: 56,
              background: "#E7F5F1",
              color: "#1F6F6B",
            }}
          >
            <Lock size={24} />
          </div>
          <h1
            className="text-xl font-bold text-center mb-1"
            style={{ color: "#1E2B2A" }}
          >
            دخول لوحة التحكم
          </h1>
          <p className="text-xs text-center mb-6" style={{ color: "#475569" }}>
            هذه الصفحة مخصصة لإدارة العيادة فقط
          </p>

          <div className="space-y-3">
            <input
              type="email"
              dir="ltr"
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border text-sm text-right outline-none transition-all duration-200 focus:scale-[1.01]"
              style={{ borderColor: "#D6D3CC" }}
              onFocus={(e) => (e.target.style.borderColor = "#1F6F6B")}
              onBlur={(e) => (e.target.style.borderColor = "#D6D3CC")}
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                dir="ltr"
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 pl-11 rounded-xl border text-sm text-right outline-none transition-all duration-200 focus:scale-[1.01]"
                style={{ borderColor: "#D6D3CC" }}
                onFocus={(e) => (e.target.style.borderColor = "#1F6F6B")}
                onBlur={(e) => (e.target.style.borderColor = "#D6D3CC")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "#94A3B8" }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div
              className="mt-3 py-2 px-3 rounded-lg text-xs text-center"
              style={{ background: "#FEE2E2", color: "#DC2626" }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-5 py-3 rounded-xl font-bold text-sm transition disabled:opacity-60"
            style={{ background: "#1F6F6B", color: "#fff" }}
          >
            {loading ? "جاري الدخول..." : "دخول"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div
        className="flex items-center justify-between px-4 sm:px-6 py-2.5 gap-3"
        style={{ background: "#14504D" }}
      >
        <span
          className="text-[11px] sm:text-xs truncate"
          style={{ color: "#A9DDD0" }}
        >
          {session.user.email}
        </span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition hover:scale-105 shrink-0"
          style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}
        >
          <LogOut size={13} />
          تسجيل خروج
        </button>
      </div>
      {children}
    </div>
  );
};

export default AdminGate;
