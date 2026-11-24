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
]);
