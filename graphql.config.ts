const config = {
  overwrite: true,
  schema: "https://voiceless-tedda-torus-bd3c6e6a.koyeb.app/graphql",
  documents: ["src/**/*.ts", "src/**/*.graphql"],
  generates: {
    "src/graphql/generated/schema.ts": {
      config: {
        useTypeImports: true, // NOTE: Fix for the typescript-graphql-request package
        enumsAsTypes: true,
        scalars: {
          DateTime: "string",
        },
        avoidOptionals: {
          field: true,
          inputValue: false,
          object: true,
          defaultValue: true,
        },
      },
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-graphql-request", // NOTE: there are some issues with this library, for more info see: https://github.com/dotansimha/graphql-code-generator-community/issues/501,
      ],
    },
  },
};

export default config;
