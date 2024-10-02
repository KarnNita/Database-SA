import { Elysia,t } from "elysia";
import db from "./db";
import { password } from "bun";

const app = new Elysia({ prefix: "/staff" });

app.get("/searchbyID/:id", async (staff_id) => {
  return await db.$queryRaw`SELECT * FROM "staff" WHERE "staff_id" like ${staff_id};`;
});

app.get("/searchbyName/:name", async (staff_name) => {
    return await db.$queryRaw`SELECT * FROM "staff" WHERE "staff_name" like ${staff_name};`;
  });

app.get("/getStaffList", async () => {
  return await db.$queryRaw`SELECT * FROM "staff";`;
});

app.get("/getStaff์Name", async (staff_id) => {
  return await db.$queryRaw`SELECT name FROM "staff" WHERE role = "Staff" AND staff_id like ${staff_id} ;`;
});

app.get("/getDoctorName", async (staff_id) => {
  return await db.$queryRaw`SELECT name FROM "staff" WHERE role = "Doctor" AND staff_id like ${staff_id} ;`;
});

app.post("/addStaff", async ({body}) => {
  const { username, staff_name, birthday, gender, staff_phone_number, role, password, email } = body;

  const result = await db.$queryRaw`
    INSERT INTO "Staff" 
    ("username", staff_name, birthday, gender, staff_phone_number, role, password, email) 
    VALUES (${username}, ${staff_name}, ${birthday}, ${gender}, ${staff_phone_number}, ${role}, ${password}, ${email});
  `;
  
  return { success: true, message: "Staff added successfully", result };
},{body:t.Object({
  username:t.String({minLength:1, maxLength:50}), staff_name:t.String({minLength:1, maxLength:50}), birthday:t.Date(), gender:t.String({minLength:1, maxLength:10}), staff_phone_number:t.String({minLength:1, maxLength:20}), role:t.String({minLength:1, maxLength:10}), password:t.String({minLength:1, maxLength:255}), email:t.String({minLength:1, maxLength:50}) 
})});


app.get("/login/:username/:password", async ({ params }) => {
  return await db.$queryRaw`SELECT "id" FROM "Staff" WHERE "username" like ${params.username} AND "password" like ${params.password};`;
});


// INSERT INTO Staff ("username", staff_name, birthday, gender, staff_phone_number, role, password, email) 
// VALUES 
// ('jdoe', 'John Doe', '1985-04-12', 'Male', '0891571648', 'Doctor', 'password123', 'jdoe@example.com'),
// ('hiho', 'Hiho Ho', '1990-07-25', 'Female', '0771541234', 'Staff', 'securepass456', 'hiho@example.com');


export default app;