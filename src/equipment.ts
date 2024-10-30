import { Elysia, t } from "elysia";
import db from "./db";

interface Equipment {
    equipment_id: number;
    equipment_name: string;
    price: number;
    amount: number;
}

const app = new Elysia({ prefix: "/equipment", detail: { tags: ["Equipment"] } });

app.get("/getEquipment", async () => {
    const result: Equipment[] = await db.$queryRaw`SELECT equipment_id, equipment_name, price, amount FROM "equipment";`;
    return result;
});

app.get("/getEquipmentNameAmount", async () => {
    return await db.$queryRaw`SELECT equipment_name, amount FROM "equipment";`;
});

app.get("/searchbyID/:equipment_id", async ({ params }) => {
    const result: Equipment[] = await db.$queryRaw`SELECT equipment_id, equipment_name, price, amount FROM "equipment" WHERE "equipment_id" = ${Number(params.equipment_id)} LIMIT 1;`;
    
    if (result.length === 0) {
        return { success: false, message: "Equipment not found." };
    }
    return { success: true, data: result[0] };
});

app.get("/getNamebyID/:equipment_id", async ({ params }) => {
    const result = await db.$queryRaw`SELECT equipment_name FROM "equipment" WHERE "equipment_id" = ${Number(params.equipment_id)} LIMIT 1;`;
    return result;
});

app.get("/getPricebyID/:equipment_id", async ({ params }) => {
    const result = await db.$queryRaw`SELECT price FROM "equipment" WHERE "equipment_id" = ${Number(params.equipment_id)} LIMIT 1;`;
    return result;
});

app.post("/editCount", async ({ body }) => {
    const { equipment_id, amount } = body;

    try {
        const result = await db.$queryRaw`
            UPDATE "equipment"
            SET amount = ${amount}
            WHERE "equipment_id" = ${equipment_id};
        `;

        return { success: true, message: "Amount updated successfully", result };
    } catch (error: unknown) { // กำหนดประเภทเป็น unknown
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred."; // ตรวจสอบประเภทของ error
        return { success: false, message: "Failed to update amount", error: errorMessage };
    }
}, {
    body: t.Object({
        equipment_id: t.Integer({ minimum: 0, maximum: 9999 }),
        amount: t.Integer({ minimum: 0, maximum: 9999 }),
    }),
});

export default app;
