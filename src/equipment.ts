import { Elysia, t } from "elysia";
import db from "./db";

const app = new Elysia({ prefix: "/equipment", detail: { tags: ["Equipment"] } });

interface Equipment {
  equipment_id: number;
  equipment_name: string;
  price: number;
  amount: number;
}

interface ExistingEquipment {
  amount: number;
}

app.get("/getEquipment", async () => {
  return await db.$queryRaw`SELECT equipment_id, equipment_name, price, amount FROM "equipment";`;
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

app.get("/searchbyName/:equipment_name", async ({ params }) => {
  return await db.$queryRaw`SELECT staff_id, "username", staff_name, birthday, gender, staff_phone_number, role, password, email FROM "staff" WHERE LOWER(replace("equipment_name",' ','')) like '%' || ${params.equipment_name} || '%';`;
});

app.post(
  "/editEquipment",
  async ({ body }: { body: Equipment }) => {
    try {
      const {
        equipment_id,
        equipment_name,
        price,
        amount,
      } = body;

      const existingEquipment = await db.$queryRaw<ExistingEquipment[]>`
        SELECT "amount" FROM "equipment" WHERE "equipment_id" = ${equipment_id};
      `;

      if (existingEquipment.length === 0) {
        return {
          success: false,
          error: "Equipment not found",
        };
      }
      
      const newAmount = existingEquipment[0].amount + amount; 

      await db.$queryRaw`
        UPDATE "equipment"
        SET
          "equipment_name" = ${equipment_name},
          "price" = ${price},
          "amount" = ${newAmount}
        WHERE "equipment_id" = ${equipment_id};
      `;

      return { success: true, message: "Equipment updated successfully" };
    } catch (error: any) {
      return {
        success: false,
        error: "Error while updating equipment data",
        details: error.message,
      };
    }
  },
  {
    body: t.Object({
      equipment_id: t.Integer({ minimum: 0 }),
      equipment_name: t.String({ minLength: 1, maxLength: 100 }),
      price: t.Number({ minimum: 0 }),
      amount: t.Integer({ minimum: 0 }), 
    }),
  }
);

export default app;
