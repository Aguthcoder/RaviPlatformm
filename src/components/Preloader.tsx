"use client";

export default function Preloader() {
  return (
    <div className="preloader-overlay">
      <div className="preloader-content">
        <div className="preloader-logo">Ravi</div>
        <div className="preloader-dots">
          <span className="dot dot-1" />
          <span className="dot dot-2" />
          <span className="dot dot-3" />
        </div>
      </div>
    </div>
  );
}
