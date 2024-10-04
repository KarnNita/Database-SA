import { Elysia } from "elysia";
import db from "./db";
import { password } from "bun";

const app = new Elysia({ prefix: "/equipment", detail: { tags: ["Equipment"] } });

app.get("/getEquipment", async () => {
    return await db.$queryRaw`SELECT equipment_id, equipment_name, price, amount FROM "equipment";`;
});

app.get("/searchbyID/:equipment_id", async ({ params }) => {
    return await db.$queryRaw`SELECT equipment_id, equipment_name, price, amount FROM "equipment" WHERE "equipment_id" = ${Number(params.equipment_id)} LIMIT 1;`;
});

app.get("/searchbyName/:equipment_name", async ({params}) => {
  return await db.$queryRaw`SELECT staff_id, "username", staff_name, birthday, gender, staff_phone_number, role, password, email FROM "staff" WHERE LOWER(replace("equipment_name",' ','')) like '%' || ${params.equipment_name} || '%';;`;
});

app.patch("/updateAmount/:equipment_id", async ({ params, body }) => {
  const equipmentId = Number(params.equipment_id);
  const { amount } = body as { amount: number }; 
  const newAmount = Number(amount);  
  if (isNaN(newAmount) || newAmount < 0) {
      return { error: "Invalid amount" };
  }
  await db.$executeRaw`UPDATE "equipment" SET "amount" = ${newAmount} WHERE "equipment_id" = ${equipmentId};`;

  return { success: true, message: `Updated amount for equipment ID ${equipmentId} to ${newAmount}` };
});//not work



export default app;
