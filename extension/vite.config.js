import { defineConfig } from "vite";
import { crx } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
import manifest from "./manifest.json";

export default defineConfig({
    plugins: [react(), crx({ manifest })]
});
