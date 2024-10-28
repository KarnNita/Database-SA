import { Elysia, t } from "elysia";
import db from "./db";
import { password } from "bun";

const app = new Elysia({ prefix: "/staff", detail: { tags: ["Staff"] } });

app.get("/searchbyID/:staff_id", async ({ params }) => {
  return await db.$queryRaw`SELECT staff_id, "username", staff_name, birthday, gender, staff_phone_number, role, password, email FROM "staff" WHERE "staff_id" = ${Number(
    params.staff_id
  )} Limit 1;`;
});

app.get("/searchbyName/:staff_name", async ({ params }) => {
  return await db.$queryRaw`SELECT staff_id, "username", staff_name, birthday, gender, staff_phone_number, role, password, email FROM "staff" WHERE LOWER(replace("staff_name",' ','')) like '%' || ${params.staff_name} || '%';;`;
});

app.get("/searchbyUsername/:username", async ({ params }) => {
  return await db.$queryRaw`SELECT staff_id, "username", staff_name, birthday, gender, staff_phone_number, role, password, email FROM "staff" WHERE LOWER(replace("username",' ','')) like '%' || ${params.username} || '%';;`;
});

app.get("/getNamebyID/:staff_id", async ({ params }) => {
  return await db.$queryRaw`SELECT staff_name FROM "staff" WHERE "staff_id" = ${Number(
    params.staff_id
  )} LIMIT 1;`;
});

app.get("/getStaffList", async () => {
  return await db.$queryRaw`SELECT staff_id, "username", staff_name, birthday, gender, staff_phone_number, role, email FROM "staff";`;
});

app.get("/getStaffName/:staff_id", async ({ params }) => {
  return await db.$queryRaw`SELECT staff_name FROM "staff" WHERE role = 'Staff' AND staff_id = ${Number(
    params.staff_id
  )}  Limit 1;`;
});

app.get("/getDoctorName/:staff_id", async ({ params }) => {
  return await db.$queryRaw`SELECT staff_name FROM "staff" WHERE role = 'Doctor' AND staff_id = ${Number(
    params.staff_id
  )} Limit 1;`;
});

app.post(
  "/addStaff",
  async ({ body }) => {
    const {
      username,
      staff_name,
      birthday,
      gender,
      staff_phone_number,
      role,
      password,
      email,
    } = body;

    const result = await db.$queryRaw`
    INSERT INTO "staff" 
    ("username", staff_name, birthday, gender, staff_phone_number, role, password, email) 
    VALUES (${username}, ${staff_name}, ${birthday}, ${gender}, ${staff_phone_number}, ${role}, ${password}, ${email});
  `;

    return { success: true, message: "Staff added successfully", result };
  },
  {
    body: t.Object({
      username: t.String({ minLength: 1, maxLength: 50 }),
      staff_name: t.String({ minLength: 1, maxLength: 50 }),
      birthday: t.Date(),
      gender: t.String({ minLength: 1, maxLength: 10 }),
      staff_phone_number: t.String({ minLength: 10, maxLength: 10 }),
      role: t.String({ minLength: 1, maxLength: 10 }),
      password: t.String({ minLength: 1, maxLength: 255 }),
      email: t.String({ minLength: 1, maxLength: 50 }),
    }),
  }
);

app.post(
  "/editStaff",
  async ({ body }) => {
    const {
      staff_id,
      username,
      staff_name,
      birthday,
      gender,
      staff_phone_number,
      role,
      email,
    } = body;

    const result = await db.$queryRaw`
    UPDATE "staff"  SET
    ("username" = ${username}, staff_name = ${staff_name}, birthday = ${birthday}, gender = ${gender}, staff_phone_number = ${staff_phone_number}, role = ${role}, email = ${email}) 
    WHERE "staff_id"  = ${staff_id}
  `;

    return { success: true, message: "Staff added successfully", result };
  },
  {
    body: t.Object({
      staff_id: t.Integer({ minimum: 0, maximum: 9999 }),
      username: t.String({ minLength: 1, maxLength: 50 }),
      staff_name: t.String({ minLength: 1, maxLength: 50 }),
      birthday: t.Date(),
      gender: t.String({ minLength: 1, maxLength: 10 }),
      staff_phone_number: t.String({ minLength: 10, maxLength: 10 }),
      role: t.String({ minLength: 1, maxLength: 10 }),
      email: t.String({ minLength: 1, maxLength: 50 }),
    }),
  }
);

app.get("/login/:username/:password", async ({ params }) => {
  return await db.$queryRaw`SELECT "staff_id" FROM "staff" WHERE "username" like ${params.username} AND "password" like ${params.password};`;
});

// INSERT INTO Staff ("username", staff_name, birthday, gender, staff_phone_number, role, password, email)
// VALUES
// ('jdoe', 'John Doe', '1985-04-12', 'Male', '0891571648', 'Doctor', 'password123', 'jdoe@example.com'),
// ('hiho', 'Hiho Ho', '1990-07-25', 'Female', '0771541234', 'Staff', 'securepass456', 'hiho@example.com');

export default app;
