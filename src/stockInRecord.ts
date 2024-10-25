import { Elysia,t } from "elysia";
import db from "./db";
import { password } from "bun";

const app = new Elysia({ prefix: "/stockinrecord", detail: {tags: ["StockInRecord"]} });

app.get("/getStockInRecord", async () => {
    return await db.$queryRaw`SELECT stock_in_id, stock_in_date, equipment_id, amount, staff_id FROM "stockinrecord";`;
  });

app.get("/searchbyID/:stock_in_id", async ({ params }) => {
    return await db.$queryRaw`SELECT stock_in_id, stock_in_date, equipment_id, amount, staff_id FROM "stockinrecord" WHERE "stock_in_id" = ${Number(params.stock_in_id)} LIMIT 1;`;
});

app.get("/searchbyDate/:stock_in_date", async ({ params }) => {
  return await db.$queryRaw` SELECT stock_in_id, stock_in_date, equipment_id, amount, staff_id FROM "stockinrecord" WHERE to_char("stock_in_date", 'YYYY-MM-DD') LIKE ${params.stock_in_date || ''} || '%';`;
});

app.post("/addRecord", async ({body}) => {
  const {stock_in_date, equipment_id, amount, staff_id } = body;

  const result = await db.$queryRaw`
    INSERT INTO "stockinrecord" 
    (stock_in_date, equipment_id, amount, staff_id) 
    VALUES (${stock_in_date}, ${equipment_id}, ${amount}, ${staff_id});
  `;
  
  return { success: true, message: "Record added successfully", result };
},{body:t.Object({
  stock_in_date:t.Date(), equipment_id:t.Integer(),  amount:t.Integer({minimum : 0}), staff_id:t.Integer()}) 
});

export default app;