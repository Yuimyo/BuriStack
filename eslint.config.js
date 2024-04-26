import globals from "globals";
import eslint from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactRecommended from "eslint-plugin-react/configs/recommended.js";
import reactJSXRuntime from "eslint-plugin-react/configs/jsx-runtime.js";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";
import eslintConfigPrettier from "eslint-config-prettier";

const compat = new FlatCompat();

export default tseslint.config(
    {
        ignores: [
            "node_modules",
            ".cache",
            "build",
            "public/build",
            ".env",
            "!**/.server",
            "!**/.client",
        ],
    },
    {
        ...eslint.configs.recommended,
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.commonjs,
                ...globals.es6,
            },
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
                // ecmaVersion: 6,
            },
        },
    },
    // React
    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        ...reactRecommended,
        ...reactJSXRuntime,
        rules: {
            ...reactRecommended.rules,
            ...reactJSXRuntime.rules,
        },
        languageOptions: {
            ...reactRecommended.languageOptions,
            ...reactJSXRuntime.languageOptions,
        },
        plugins: {
            react: reactPlugin,
            ["jsx-a11y"]: jsxA11yPlugin,
        },
        extends: [
            ...compat.config(reactHooksPlugin.configs.recommended),
            ...compat.config(jsxA11yPlugin.configs.recommended),
        ],
        settings: {
            react: {
                version: "detect",
            },
            formComponents: ["Form"],
            linkComponents: [
                { name: "Link", linkAttribute: "to" },
                { name: "NavLink", linkAttribute: "to" },
            ],
            "import/resolver": {
                typescript: {},
            },
        },
    },
    // Typescript
    {
        files: ["**/*.{ts,tsx}"],
        plugins: {
            import: importPlugin,
        },
        extends: [
            ...tseslint.configs.recommended,
            ...compat.config(importPlugin.configs.recommended),
            ...compat.config(importPlugin.configs.typescript),
        ],
        settings: {
            "import/resolver": {
                node: {
                    extensions: [".ts", ".tsx"],
                },
                typescript: {
                    alwaysTryTypes: true,
                    project: "tsconfig.json",
                },
            },
        },
    },
    {
        files: ["eslint.config.js"],
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },
    eslintConfigPrettier,
);
