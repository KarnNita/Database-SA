import { Elysia } from "elysia";
import db from "./db";
import { password } from "bun";

const app = new Elysia({ prefix: "/treatmenttype", detail: {tags: ["TreatmentType"]} });

app.get("/getTreatmentList", async () => {
    return await db.$queryRaw`SELECT treatment_id, cost, treatment_name FROM "treatmenttype";`;
  });

app.get("/searchbyID/:treatment_id", async ({ params }) => {
    return await db.$queryRaw`SELECT treatment_id, cost, treatment_name FROM "treatmenttype" WHERE "treatment_id" = ${Number(params.treatment_id)} LIMIT 1;`;
});

app.get("/searchbyName/:treatment_name", async ({params}) => {
  return await db.$queryRaw`SELECT treatment_id, cost, treatment_name FROM "treatmenttype" WHERE LOWER(replace("treatment_name",' ','')) like '%' || ${params.treatment_name} || '%';;`;
});

app.get("/getNamebyID/:treatment_id", async ({ params }) => {
  return await db.$queryRaw`SELECT treatment_name FROM "treatmenttype" WHERE "treatment_id" = ${Number(params.treatment_id)} LIMIT 1;`;
});

app.get("/getTreatmentNameList", async () => {
  return await db.$queryRaw`SELECT treatment_name FROM "treatmenttype";`;
});

export default app;