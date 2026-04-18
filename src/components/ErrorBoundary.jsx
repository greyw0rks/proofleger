"use client";
import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ProofLedger error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{ border:"3px solid #ff3333", padding:24,
          fontFamily:"Space Grotesk, sans-serif", background:"#0a0a0a" }}>
          <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:16,
            color:"#ff3333", marginBottom:8 }}>SOMETHING WENT WRONG</div>
          <div style={{ fontFamily:"Space Mono, monospace", fontSize:11, color:"#666",
            marginBottom:16 }}>{this.state.error?.message || "Unknown error"}</div>
          <button onClick={() => this.setState({ hasError: false, error: null })}
            style={{ border:"2px solid #f5f0e8", background:"transparent", color:"#f5f0e8",
              padding:"8px 16px", fontFamily:"Archivo Black, sans-serif", fontSize:11, cursor:"pointer" }}>
            TRY AGAIN
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}