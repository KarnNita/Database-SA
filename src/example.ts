import { Elysia } from "elysia";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const app = new Elysia();

app.get("/", async () => {
  const data = await db.$queryRaw`SELECT * FROM "User";`;
  return data;
});

app.get("/register/:username/:password", async ({ params }) => {
  const data = await db.$queryRaw`INSERT INTO "User"
  ("username", "password") VALUES (${params.username}, ${params.password})
  RETURNING *;`;
  return data;
});

app.get("/delete/:id", async ({ params }) => {
  const userid = parseInt(params.id);
  await db.$queryRaw`DELETE FROM "User" WHERE id = ${userid};`;
  return {
    message: "User deleted",
  };
});

app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
