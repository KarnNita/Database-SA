import { Elysia } from "elysia";
import db from "./db";
import { password } from "bun";

const app = new Elysia({ prefix: "/patient" });

app.get("/searchbyID/:id", async (id) => {
  return await db.$queryRaw`SELECT * FROM "patient" WHERE "id" like ${id};`;
});

app.get("/searchbyName/:name", async (id) => {
    return await db.$queryRaw`SELECT * FROM "patient" WHERE "name" like ${id};`;
  });

app.get("/getPatientList", async () => {
  return await db.$queryRaw`SELECT * FROM "patient";`;
});

// INSERT INTO Patient ("name", phone_number, birthday, gender, appoinment_date, course_count) values (
//   'Prakasit J','1234567891','2024-01-04','Male', '2024-01-04', 10
//   )


export default app;