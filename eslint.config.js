// eslint.config.js
import js from "@eslint/js";
import globals from "globals";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    ignores: ["dist/**"], // <--- tell ESLint to skip dist
  },
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json"
      },
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    plugins: {
      "@typescript-eslint": tseslint,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      // TypeScript rules
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      // React rules
      "react/react-in-jsx-scope": "off", // not needed with React 17+
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn"
    },
    settings: {
      react: {
        version: "detect"
      }
    }
  }
  , {
    // Node-specific files
    files: ["server-dev.js", "server/**"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node // adds process, Buffer, console, etc.
      }
    }
  }
  , {
    files: ["vite.config.ts"],
    languageOptions: {
      parserOptions: {
        project: null
      }
    }
  }
];