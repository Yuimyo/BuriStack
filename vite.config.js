/// <reference types="vitest" />
import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

installGlobals();

export default defineConfig({
    plugins: [
        remix({
            ignoredRouteFiles: ["**/*.css", "**/*.css.map", "**/*.scss"],
        }),
        tsconfigPaths(),
    ],
    css: {
        modules: {
            localsConvention: "camelCaseOnly",
        },
    },
    test: {
        setupFiles: ["./eslint-local/viteslint.setup.ts"],
    },
});
