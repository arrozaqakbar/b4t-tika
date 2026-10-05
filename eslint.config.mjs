import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [".next/*", "node_modules/*", "dist/*", "next-env.d.ts"],
  },
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/triple-slash-reference": "off",
    },
  }
);
