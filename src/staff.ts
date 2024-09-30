import { Elysia } from "elysia";
import db from "./db";
import { password } from "bun";

const app = new Elysia({ prefix: "/staff" });

app.get("/searchbyID/:id", async (id) => {
  return await db.$queryRaw`SELECT * FROM "Staff" WHERE "id" like ${id};`;
});

app.get("/searchbyName/:name", async (id) => {
    return await db.$queryRaw`SELECT * FROM "Staff" WHERE "name" like ${id};`;
  });

app.get("/getStaffList", async () => {
  return await db.$queryRaw`SELECT * FROM "Staff";`;
});


app.get("/login/:username/:password", async ({ params }) => {
  return await db.$queryRaw`SELECT "id" FROM "Staff" WHERE "username" like ${params.username} AND "password" like ${params.password};`;
});

export default app;