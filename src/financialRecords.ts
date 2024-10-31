import { Elysia, t } from "elysia";
import db from "./db";
import { password } from "bun";

const app = new Elysia({ prefix: "/financialrecords", detail: {tags: ["FinancialRecords"]} });

app.get("/getFinancialRecords", async () => {
    return await db.$queryRaw`SELECT * FROM "financialrecords";`;
  });

app.get("/getIncome", async () => {
  return await db.$queryRaw`SELECT financial_record_id, record_date, income_and_expenses, cost, staff_id FROM "financialrecords" WHERE income_and_expenses = 'income';`;
});

app.get("/getExpense", async () => {
  return await db.$queryRaw`SELECT financial_record_id, record_date, income_and_expenses, cost, staff_id FROM "financialrecords" WHERE income_and_expenses = 'expenses';`;
});

app.get("/searchbyID/:staff_id", async ({params}) => {
  return await db.$queryRaw`SELECT financial_record_id, record_date, income_and_expenses, cost, staff_id FROM "financialrecords" WHERE "staff_id" = ${Number(params.staff_id)};`;
});

app.post("/addRecord", async ({body}) => {
  const { record_date, income_and_expenses, cost, staff_id } = body;

  const result = await db.$queryRaw`
    INSERT INTO "financialrecords" 
    (record_date, income_and_expenses, cost, staff_id) 
    VALUES (${record_date}, ${income_and_expenses}, ${cost}, ${staff_id});
  `;
  
  return { success: true, message: "Record added successfully", result };
},{body:t.Object({
  record_date:t.Date(), income_and_expenses:t.String({minLength : 5, maxLength :8}), cost:t.Number({minimum : 0}),  staff_id:t.Integer()}) 
});

  

export default app;