import React, { useState, useEffect } from 'react';
import { getEntries, addEntry, deleteEntry, login, register, logout, getMe } from './data/entryService';
import EntryForm from './components/EntryForm';
import EntryList from './components/EntryList';
import StatsDashboard from './components/StatsDashboard';

function App() {
  const [user, setUser]       = useState(null);
  const [entries, setEntries] = useState([]);
  const [totals, setTotals]   = useState({});
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState("login"); // "login" | "register"
  const [authForm, setAuthForm] = useState({ username: "", password: "" });
  const [authError, setAuthError] = useState("");

  // On mount: check if already logged in
  useEffect(() => {
    getMe().then(username => {
      setUser(username);
      setLoading(false);
    });
  }, []);

  // Whenever user changes, load their entries
  useEffect(() => {
    if (user) refreshEntries();
  }, [user]);

  const refreshEntries = async () => {
    const data = await getEntries();
    setEntries(data.entries || []);
    setTotals(data.totals || {});
  };

  const handleAdd = async (newEntry) => {
    await addEntry(newEntry);
    await refreshEntries();
  };

  const handleDelete = async (id) => {
    await deleteEntry(id);
    await refreshEntries();
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError("");
    const { username, password } = authForm;

    if (authMode === "register") {
      const res = await register(username, password);
      if (res.error) { setAuthError(res.error); return; }
      setAuthMode("login");
      setAuthError("Account created! Please log in.");
      return;
    }

    const { data, ok } = await login(username, password);
    if (!ok) { setAuthError(data.error || "Login failed"); return; }
    setUser(username);
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setEntries([]);
    setTotals({});
  };

  // ── Loading splash ──────────────────────────────────────────────────────
  if (loading) {
    return <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>;
  }

  // ── Login / Register screen ─────────────────────────────────────────────
  if (!user) {
    return (
      <div style={{ maxWidth: 360, margin: "80px auto", padding: 24 }}>
        <h1 style={{ marginBottom: 24 }}>🥗 Calorie Tracker</h1>
        <h2>{authMode === "login" ? "Log In" : "Create Account"}</h2>
        <form onSubmit={handleAuth}>
          <div style={{ marginBottom: 12 }}>
            <input
              placeholder="Username"
              value={authForm.username}
              onChange={e => setAuthForm(f => ({ ...f, username: e.target.value }))}
              required
              style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <input
              type="password"
              placeholder="Password"
              value={authForm.password}
              onChange={e => setAuthForm(f => ({ ...f, password: e.target.value }))}
              required
              style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
            />
          </div>
          {authError && <p style={{ color: "red", marginBottom: 8 }}>{authError}</p>}
          <button type="submit" style={{ width: "100%", padding: 10 }}>
            {authMode === "login" ? "Log In" : "Register"}
          </button>
        </form>
        <p style={{ marginTop: 16, textAlign: "center" }}>
          {authMode === "login" ? (
            <>No account? <button onClick={() => { setAuthMode("register"); setAuthError(""); }}>Register</button></>
          ) : (
            <>Already have one? <button onClick={() => { setAuthMode("login"); setAuthError(""); }}>Log In</button></>
          )}
        </p>
      </div>
    );
  }

  // ── Main app ────────────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>🥗 Calorie Tracker</h1>
        <div>
          <span style={{ marginRight: 12 }}>Hello, <strong>{user}</strong></span>
          <button onClick={handleLogout}>Log Out</button>
        </div>
      </div>

      <StatsDashboard entries={entries} totals={totals} />
      <EntryForm onAdd={handleAdd} />
      <EntryList entries={entries} onDelete={handleDelete} />
    </div>
  );
}

export default App;
