"use client";
import { Component } from "react";

/**
 * ErrorBoundary catches runtime errors in the component tree
 * and renders a neo-brutalist fallback UI.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ProofLedger ErrorBoundary caught:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div style={{ border: "3px solid #ff3333", padding: "24px", background: "#0a0a0a", color: "#f5f0e8", fontFamily: "Space Grotesk, sans-serif", boxShadow: "6px 6px 0px #ff3333" }}>
          <p style={{ fontFamily: "Archivo Black, sans-serif", color: "#ff3333", marginBottom: "12px", fontSize: "18px" }}>Something went wrong</p>
          <p style={{ fontSize: "14px", color: "#999", marginBottom: "16px" }}>{this.state.error?.message || "An unexpected error occurred."}</p>
          <button onClick={this.handleReset} style={{ background: "#f5f0e8", color: "#0a0a0a", border: "3px solid #f5f0e8", padding: "8px 16px", fontFamily: "Archivo Black, sans-serif", cursor: "pointer", boxShadow: "3px 3px 0px #F7931A" }}>
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
