import React from "react";
import { createRoot } from "react-dom/client";
import App from "./Cloud9Store.jsx";

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || String(error) };
  }

  componentDidCatch(error) {
    // Keep detail in devtools while showing a user-visible fallback.
    console.error("App render error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#121212",
            color: "#fff",
            fontFamily: "system-ui, sans-serif",
            padding: 24,
          }}
        >
          <div style={{ maxWidth: 720, width: "100%" }}>
            <h1 style={{ marginTop: 0, fontSize: 20 }}>App failed to render</h1>
            <p style={{ opacity: 0.9, marginBottom: 8 }}>
              A runtime error occurred. See message below:
            </p>
            <pre
              style={{
                margin: 0,
                whiteSpace: "pre-wrap",
                background: "#1e1e1e",
                border: "1px solid #333",
                borderRadius: 8,
                padding: 12,
                fontSize: 13,
              }}
            >
              {this.state.message}
            </pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById("root")).render(
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>
);
