import { Elysia,t } from "elysia";
import db from "./db";
import { password } from "bun";

const app = new Elysia({ prefix: "/requisition", detail: {tags: ["Requisition"]} });

app.get("/getRequisition", async () => {
    return await db.$queryRaw`SELECT requisition_id, use_amount, requisition_date, equipment_id, staff_id FROM "requisition";`;
  });

app.get("/searchbyStaffID/:staff_id", async ({ params }) => {
    return await db.$queryRaw`SELECT requisition_id, use_amount, requisition_date, equipment_id, staff_id FROM "requisition" WHERE "staff_id" = ${Number(params.staff_id)} ;`;
});

app.get("/searchbyEquipmentID/:equipment_id", async ({ params }) => {
  return await db.$queryRaw`SELECT requisition_id, use_amount, requisition_date, equipment_id, staff_id FROM "requisition" WHERE "equipment_id" = ${Number(params.equipment_id)} ;`;
});

app.get("/searchbyRequisitionID/:requisition_id", async ({ params }) => {
    return await db.$queryRaw`SELECT requisition_id, use_amount, requisition_date, equipment_id, staff_id FROM "requisition" WHERE "requisition_id" = ${Number(params.requisition_id)} LIMIT 1;`;
});

app.get("/searchbyDate/:requisition_date", async ({ params }) => {
  return await db.$queryRaw` SELECT requisition_id, use_amount, requisition_date, equipment_id, staff_id FROM "requisition" WHERE to_char("requisition_date", 'YYYY-MM-DD') LIKE ${params.requisition_date || ''} || '%';`;
});

app.post("/addRecord", async ({body}) => {
  const {use_amount, requisition_date, equipment_id, staff_id } = body;

  const result = await db.$queryRaw`
    INSERT INTO "requisition" 
    (use_amount, requisition_date, equipment_id, staff_id) 
    VALUES (${use_amount}, ${requisition_date}, ${equipment_id}, ${staff_id});
  `;
  
  return { success: true, message: "Record added successfully", result };
},{body:t.Object({
  use_amount:t.Integer({minimum : 0}), requisition_date:t.Date(), equipment_id:t.Integer(), staff_id:t.Integer()}) 
});

export default app;