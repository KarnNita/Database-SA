import { Elysia, t } from "elysia";
import db from "./db";
import { password } from "bun";

const app = new Elysia({ prefix: "/equipment", detail: { tags: ["Equipment"] } });

interface Equipment {
  equipment_id: number;
  equipment_name: string;
  price: number;
  amount: number;
}

app.get("/getEquipment", async () => {
  const equipments: Equipment[] = await db.$queryRaw`SELECT equipment_id, equipment_name, price, amount FROM "equipment";`;
  return equipments;
});

app.get("/getEquipmentNameAmount", async () => {
  return await db.$queryRaw`SELECT equipment_name, amount FROM "equipment";`;
});

app.get("/searchbyID/:equipment_id", async ({ params }) => {
    return await db.$queryRaw`SELECT equipment_id, equipment_name, price, amount FROM "equipment" WHERE "equipment_id" = ${Number(params.equipment_id)} LIMIT 1;`;
});

app.get("/getNamebyID/:equipment_id", async ({ params }) => {
  return await db.$queryRaw`SELECT equipment_name FROM "equipment" WHERE "equipment_id" = ${Number(params.equipment_id)} LIMIT 1;`;
});

app.get("/getPricebyID/:equipment_id", async ({ params }) => {
  return await db.$queryRaw`SELECT price FROM "equipment" WHERE "equipment_id" = ${Number(params.equipment_id)} LIMIT 1;`;
});

app.get("/searchbyName/:equipment_name", async ({params}) => {
  return await db.$queryRaw`SELECT staff_id, "username", staff_name, birthday, gender, staff_phone_number, role, password, email FROM "staff" WHERE LOWER(replace("equipment_name",' ','')) like '%' || ${params.equipment_name} || '%';;`;
});

app.post(
  "/editAmount/:equipment_id",
  async ({ body }) => {
    const { equipment_id, amount } = body;

    const result = await db.$queryRaw`
      UPDATE "equipment"
      SET amount = ${amount}
      WHERE "equipment_id" = ${equipment_id};
    ` as { affectedRows: number };

    if (result.affectedRows > 0) {
      return {
        success: true,
        message: "Amount updated successfully",
      };
    } else {
      return {
        success: false,
        message: "Update failed or no rows affected",
      };
    }
  },
  {
    body: t.Object({
      equipment_id: t.Integer({ minimum: 0, maximum: 9999 }),
      amount: t.Integer({ minimum: 0 }),
    }),
  }
);

export default app;