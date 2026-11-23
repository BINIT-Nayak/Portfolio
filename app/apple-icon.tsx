import { ImageResponse } from "next/og";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        background: "#101114",
        color: "#a3bffa",
        fontSize: 72,
        fontWeight: 700,
      }}
    >
      BN
    </div>,
    size
  );
}
