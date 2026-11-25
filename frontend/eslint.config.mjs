import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
  {
    rules: {
      // Type safety
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports" },
      ],
      // React
      "react/self-closing-comp": "error",
      // General
      "no-console": ["warn", { allow: ["error", "warn"] }],
      "prefer-const": "error",
      // Environment is read in one place only (src/config/env.ts); see the override below.
      "no-restricted-syntax": [
        "error",
        {
          selector: "MemberExpression[object.name='process'][property.name='env']",
          message: "Import what you need from '@/config/env' instead of reading process.env.",
        },
      ],
    },
  },
  { files: ["src/config/env.ts"], rules: { "no-restricted-syntax": "off" } },
  {
    // The demo layer must stay out of the production bundle: load it only with import('@/demo'),
    // never with a static import (type-only imports are fine). See docs/demo-mode.md.
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/demo/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/demo", "@/demo/*"],
              allowTypeImports: true,
              message: "Load the demo layer with a dynamic import('@/demo'); a static import puts it in every build.",
            },
          ],
        },
      ],
    },
  },
]);
