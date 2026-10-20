import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/pages/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}", "./src/app/**/*.{ts,tsx}"],
  theme: { extend: { colors: { ink: "#15201b", "pine-deep": "#154a3a", pine: "#1f6b52", mint: "#dff4e9", cream: "#f7f5ef", coral: "#f28f6b", blush: "#f4ded4", sand: "#eee5c9", lavender: "#e8ddf0" }, fontFamily: { sans: ["Arial", "sans-serif"] } } },
  plugins: []
};
export default config;
