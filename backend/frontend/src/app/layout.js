import "./global.css";

export const metadata = {
  title: "MedVision AI - Orthopedic Support",
  description: "Explainable AI-Powered Fracture Analysis Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}