import { ImageResponse } from "next/og";
export const alt = "Binit Nayak — Frontend and Full Stack Engineer, Hyderabad";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        background: "#101114",
        color: "#eceef2",
        padding: 72,
      }}
    >
      <div
        style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#a3bffa" }}
      >
        <span>BN.</span>
        <span>Hyderabad, India</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 72, fontWeight: 700 }}>Binit Nayak</div>
        <div style={{ fontSize: 36, marginTop: 20 }}>Frontend / Full Stack Engineer</div>
      </div>
      <div
        style={{ fontSize: 29, color: "#b4bac5", borderTop: "1px solid #4a5260", paddingTop: 30 }}
      >
        Interfaces that behave like systems.
      </div>
    </div>,
    size
  );
}
