import React, { useState, useEffect, useCallback } from "react";
import { AuthProvider, useAuth } from "./AuthContext";
import { articlesApi, usersApi } from "./api";

// ─── Error Banner ──────────────────────────────────────────────────────────────
function ErrorBanner({ error, onDismiss }) {
  if (!error) return null;
  const isAuth = error.status === 401 || error.status === 403;
  return (
    <div
      style={{
        background: error.status === 401 ? "#3d1a1a" : "#2d1f00",
        border: `1px solid ${error.status === 401 ? "#c0392b" : "#e67e22"}`,
        borderLeft: `4px solid ${error.status === 401 ? "#e74c3c" : "#f39c12"}`,
        color: "#f8f8f8",
        padding: "12px 16px",
        borderRadius: "4px",
        marginBottom: "16px",
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
      }}
    >
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "0.05em",
            marginBottom: "4px",
          }}
        >
          {error.status === 401
            ? "401 UNAUTHORIZED — Authentication Required"
            : error.status === 403
            ? "403 FORBIDDEN — Insufficient Permissions"
            : `ERROR ${error.status}`}
        </div>
        <div style={{ fontSize: "13px", opacity: 0.85 }}>{error.message}</div>
        {isAuth && (
          <div style={{ fontSize: "11px", marginTop: "6px", opacity: 0.6 }}>
            {error.status === 401
              ? "No valid token found. Log in to continue."
              : "Your role does not have access to this resource."}
          </div>
        )}
      </div>
      <button
        onClick={onDismiss}
        style={{
          background: "none",
          border: "none",
          color: "#aaa",
          cursor: "pointer",
          fontSize: "18px",
          lineHeight: 1,
        }}
      >
        ×
      </button>
    </div>
  );
}

// ─── Login Form ────────────────────────────────────────────────────────────────
function LoginForm({ onClose }) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(username, password);
      onClose();
    } catch (err) {
      setError(
        err.response?.status === 401
          ? "401 — Invalid credentials. Check username/password."
          : "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
    >
      <div
        style={{
          background: "#1a1a1a",
          border: "1px solid #333",
          borderRadius: "8px",
          padding: "32px",
          width: "360px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.8)",
        }}
      >
        <h2
          style={{
            margin: "0 0 24px",
            fontSize: "20px",
            fontFamily: "'Georgia', serif",
            color: "#f0f0f0",
          }}
        >
          Sign In
        </h2>
        {error && (
          <div
            style={{
              background: "#2d0f0f",
              border: "1px solid #c0392b",
              borderRadius: "4px",
              padding: "10px 14px",
              color: "#ff8080",
              fontSize: "13px",
              marginBottom: "16px",
            }}
          >
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>Username</label>
            <input
              style={inputStyle}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin / alice / bob"
              required
            />
          </div>
          <div style={{ marginBottom: "24px" }}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              style={inputStyle}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <button type="submit" disabled={loading} style={primaryBtnStyle}>
              {loading ? "Signing in…" : "Sign In"}
            </button>
            <button type="button" onClick={onClose} style={secondaryBtnStyle}>
              Cancel
            </button>
          </div>
        </form>
        <div
          style={{
            marginTop: "20px",
            fontSize: "12px",
            color: "#666",
            lineHeight: "1.8",
          }}
        >
          <div style={{ color: "#888", marginBottom: "6px", fontWeight: 600 }}>
            Test accounts:
          </div>
          <code style={{ color: "#a0c4ff" }}>admin / admin123</code> → ADMIN
          <br />
          <code style={{ color: "#a0c4ff" }}>alice / pass123</code> → USER
          <br />
          <code style={{ color: "#a0c4ff" }}>bob / pass123</code> → USER
        </div>
      </div>
    </div>
  );
}

// ─── Article Form ──────────────────────────────────────────────────────────────
function ArticleForm({ article, onSave, onCancel }) {
  const [title, setTitle] = useState(article?.title || "");
  const [content, setContent] = useState(article?.content || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSave(title, content);
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "#1c1c1c",
        border: "1px solid #2e2e2e",
        borderRadius: "6px",
        padding: "24px",
        marginBottom: "24px",
      }}
    >
      <h3
        style={{
          margin: "0 0 20px",
          fontSize: "16px",
          color: "#ccc",
          fontFamily: "'Georgia', serif",
        }}
      >
        {article ? "Edit Article" : "New Article"}
      </h3>
      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>Title</label>
        <input
          style={inputStyle}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Article title"
          required
        />
      </div>
      <div style={{ marginBottom: "20px" }}>
        <label style={labelStyle}>Content</label>
        <textarea
          style={{ ...inputStyle, height: "120px", resize: "vertical" }}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your article content…"
          required
        />
      </div>
      <div style={{ display: "flex", gap: "12px" }}>
        <button type="submit" disabled={loading} style={primaryBtnStyle}>
          {loading ? "Saving…" : article ? "Update Article" : "Publish Article"}
        </button>
        <button type="button" onClick={onCancel} style={secondaryBtnStyle}>
          Cancel
        </button>
      </div>
    </form>
  );
}

// ─── Article Card ──────────────────────────────────────────────────────────────
function ArticleCard({ article, onEdit, onDelete, currentUser, isAdmin }) {
  const isOwner = currentUser === article.authorUsername;
  const canModify = isOwner || isAdmin;

  return (
    <div
      style={{
        background: "#161616",
        border: "1px solid #252525",
        borderRadius: "6px",
        padding: "22px",
        marginBottom: "14px",
        transition: "border-color 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#3a3a3a")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#252525")}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "12px",
        }}
      >
        <div style={{ flex: 1 }}>
          <h3
            style={{
              margin: "0 0 8px",
              fontSize: "17px",
              color: "#e8e8e8",
              fontFamily: "'Georgia', serif",
            }}
          >
            {article.title}
          </h3>
          <p
            style={{
              margin: "0 0 14px",
              fontSize: "14px",
              color: "#888",
              lineHeight: 1.6,
            }}
          >
            {article.content}
          </p>
          <div
            style={{
              fontSize: "12px",
              color: "#555",
              display: "flex",
              gap: "16px",
            }}
          >
            <span>
              by{" "}
              <span style={{ color: "#7a9cc4" }}>
                @{article.authorUsername}
              </span>
            </span>
            <span>
              {new Date(article.createdAt).toLocaleDateString("vi-VN")}
            </span>
            {isAdmin && !isOwner && (
              <span
                style={{
                  color: "#c0392b",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                }}
              >
                ADMIN VIEW
              </span>
            )}
          </div>
        </div>
        {canModify && (
          <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
            {isOwner && (
              <button
                onClick={() => onEdit(article)}
                style={iconBtnStyle("#2a3a2a", "#4caf50")}
              >
                Edit
              </button>
            )}
            <button
              onClick={() => onDelete(article.id)}
              style={iconBtnStyle("#3a1a1a", "#e74c3c")}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Users Panel (Admin only) ──────────────────────────────────────────────────
function UsersPanel() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    usersApi
      .getAll()
      .then((r) => setUsers(r.data))
      .catch((err) => {
        const status = err.response?.status;
        setError({
          status,
          message:
            err.response?.data?.message ||
            (status === 403 ? "Admin only." : "Error loading users."),
        });
      });
  }, []);

  if (error)
    return <ErrorBanner error={error} onDismiss={() => setError(null)} />;

  return (
    <div
      style={{
        background: "#161616",
        border: "1px solid #252525",
        borderRadius: "6px",
        padding: "20px",
      }}
    >
      <h3
        style={{
          margin: "0 0 16px",
          fontSize: "14px",
          letterSpacing: "0.1em",
          color: "#888",
          textTransform: "uppercase",
        }}
      >
        Registered Users
      </h3>
      {users.map((u) => (
        <div
          key={u.username}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 0",
            borderBottom: "1px solid #1f1f1f",
          }}
        >
          <span style={{ color: "#ccc", fontSize: "14px" }}>@{u.username}</span>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: u.role === "ADMIN" ? "#f39c12" : "#7a9cc4",
              background: u.role === "ADMIN" ? "#2d2000" : "#0f1f2d",
              padding: "3px 8px",
              borderRadius: "3px",
            }}
          >
            {u.role}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Main App ──────────────────────────────────────────────────────────────────
function AppContent() {
  const { user, logout, isAdmin, isUser } = useAuth();
  const [articles, setArticles] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("articles");

  const handleApiError = useCallback((err) => {
    const status = err.response?.status;
    const message = err.response?.data?.message || err.message;
    setError({ status, message });
  }, []);

  const loadArticles = useCallback(() => {
    articlesApi
      .getAll()
      .then((r) => setArticles(r.data))
      .catch(handleApiError);
  }, [handleApiError]);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  const handleCreate = async (title, content) => {
    try {
      await articlesApi.create(title, content);
      setShowForm(false);
      loadArticles();
    } catch (err) {
      handleApiError(err);
    }
  };

  const handleUpdate = async (title, content) => {
    try {
      await articlesApi.update(editingArticle.id, title, content);
      setEditingArticle(null);
      loadArticles();
    } catch (err) {
      handleApiError(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this article?")) return;
    try {
      await articlesApi.delete(id);
      loadArticles();
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0f0f",
        color: "#d8d8d8",
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          borderBottom: "1px solid #1e1e1e",
          padding: "0 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "60px",
          background: "#0a0a0a",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "18px",
              fontFamily: "'Georgia', serif",
              color: "#f0f0f0",
              letterSpacing: "0.02em",
            }}
          >
            ARTICLES
          </h1>
          {user && (
            <nav style={{ display: "flex", gap: "4px" }}>
              {["articles", isAdmin && "users"].filter(Boolean).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    background: activeTab === tab ? "#1e1e1e" : "none",
                    border: "none",
                    color: activeTab === tab ? "#e0e0e0" : "#666",
                    padding: "6px 14px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "13px",
                    textTransform: "capitalize",
                    transition: "all 0.15s",
                  }}
                >
                  {tab}
                </button>
              ))}
            </nav>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {user ? (
            <>
              <div style={{ fontSize: "13px", color: "#666" }}>
                <span style={{ color: "#aaa" }}>{user.username}</span>
                <span
                  style={{
                    marginLeft: "8px",
                    fontSize: "10px",
                    color: user.role === "ADMIN" ? "#f39c12" : "#7a9cc4",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    background: user.role === "ADMIN" ? "#2d2000" : "#0f1f2d",
                    padding: "2px 7px",
                    borderRadius: "3px",
                  }}
                >
                  {user.role}
                </span>
              </div>
              {isUser && !showForm && activeTab === "articles" && (
                <button
                  onClick={() => setShowForm(true)}
                  style={primaryBtnStyle}
                >
                  + New Article
                </button>
              )}
              <button onClick={logout} style={secondaryBtnStyle}>
                Sign Out
              </button>
            </>
          ) : (
            <button onClick={() => setShowLogin(true)} style={primaryBtnStyle}>
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Body */}
      <main
        style={{ maxWidth: "780px", margin: "0 auto", padding: "36px 20px" }}
      >
        {!user && (
          <div
            style={{
              textAlign: "center",
              padding: "24px",
              background: "#141414",
              border: "1px solid #252525",
              borderRadius: "6px",
              marginBottom: "24px",
            }}
          >
            <p style={{ margin: 0, fontSize: "13px", color: "#555" }}>
              You are browsing as{" "}
              <strong style={{ color: "#7a9cc4" }}>GUEST</strong>. All articles
              are readable.{" "}
              <button
                onClick={() => setShowLogin(true)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#7a9cc4",
                  cursor: "pointer",
                  textDecoration: "underline",
                  padding: 0,
                }}
              >
                Sign in
              </button>{" "}
              to create or manage articles.
            </p>
          </div>
        )}

        <ErrorBanner error={error} onDismiss={() => setError(null)} />

        {/* New/Edit form */}
        {showForm && (
          <ArticleForm
            onSave={handleCreate}
            onCancel={() => setShowForm(false)}
          />
        )}
        {editingArticle && (
          <ArticleForm
            article={editingArticle}
            onSave={handleUpdate}
            onCancel={() => setEditingArticle(null)}
          />
        )}

        {/* Articles tab */}
        {activeTab === "articles" && (
          <div>
            <div
              style={{
                fontSize: "12px",
                color: "#444",
                marginBottom: "20px",
                letterSpacing: "0.05em",
              }}
            >
              {articles.length} ARTICLES
            </div>
            {articles.length === 0 ? (
              <div
                style={{
                  color: "#444",
                  textAlign: "center",
                  padding: "48px",
                  fontSize: "14px",
                }}
              >
                No articles yet.
              </div>
            ) : (
              articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  currentUser={user?.username}
                  isAdmin={isAdmin}
                  onEdit={setEditingArticle}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        )}

        {/* Users tab (admin only) */}
        {activeTab === "users" && isAdmin && <UsersPanel />}
      </main>

      {/* Login modal */}
      {showLogin && <LoginForm onClose={() => setShowLogin(false)} />}
    </div>
  );
}

// ─── Shared Styles ─────────────────────────────────────────────────────────────
const labelStyle = {
  display: "block",
  fontSize: "11px",
  fontWeight: 700,
  color: "#666",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  marginBottom: "6px",
};
const inputStyle = {
  display: "block",
  width: "100%",
  background: "#111",
  border: "1px solid #2a2a2a",
  borderRadius: "4px",
  color: "#e0e0e0",
  fontSize: "14px",
  padding: "10px 12px",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.15s",
  fontFamily: "inherit",
};
const primaryBtnStyle = {
  background: "#2a4a7f",
  color: "#c8dcf8",
  border: "1px solid #3d6bb5",
  borderRadius: "4px",
  padding: "8px 18px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: 600,
  letterSpacing: "0.03em",
  transition: "background 0.15s",
  fontFamily: "inherit",
};
const secondaryBtnStyle = {
  background: "none",
  color: "#666",
  border: "1px solid #2a2a2a",
  borderRadius: "4px",
  padding: "8px 18px",
  cursor: "pointer",
  fontSize: "13px",
  transition: "border-color 0.15s, color 0.15s",
  fontFamily: "inherit",
};
const iconBtnStyle = (bg, border) => ({
  background: bg,
  color: border,
  border: `1px solid ${border}22`,
  borderRadius: "4px",
  padding: "5px 12px",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: 600,
  transition: "background 0.15s",
  fontFamily: "inherit",
});

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
