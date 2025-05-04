import { defineConfig } from "prisma/config";

export default defineConfig({
  earlyAccess: true,
  schema: "./src/infra/database/prisma/schema.prisma",
});
