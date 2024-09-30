import { Elysia } from "elysia";
import db from "./db";
import { password } from "bun";

const app = new Elysia({ prefix: "/patient" });

app.get("/searchbyID/:id", async (id) => {
  return await db.$queryRaw`SELECT * FROM "Patient" WHERE "id" like ${id};`;
});

app.get("/searchbyName/:name", async (id) => {
    return await db.$queryRaw`SELECT * FROM "Patient" WHERE "name" like ${id};`;
  });

app.get("/getPatientList", async () => {
  return await db.$queryRaw`SELECT * FROM "Patient";`;
});


export default app;