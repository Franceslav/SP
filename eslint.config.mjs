import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  // Глобальные игноры (не линтим сборку, зависимости и автоген)
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "src/generated/**",   // <= автоген (например, старые prisma-файлы)
      "**/*.d.ts",          // декларации типов
    ],
  },

  // Базовые пресеты Next
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Ослабляем правила только для автогенерированных файлов,
  // если вдруг попадут в репо с другим путём
  {
    files: ["**/generated/**", "**/gen/**", "**/*.d.ts"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
