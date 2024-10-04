import { Elysia,t } from "elysia";
import db from "./db";
import { password } from "bun";

const app = new Elysia({ prefix: "/patient", detail: {tags: ["Patient"]} });

app.get("/searchbyID/:patient_id", async ({params}) => {
  return await db.$queryRaw`SELECT patient_id, name, phone_number, birthday, gender, appoinment_date, course_count FROM "patient" WHERE "patient_id" = ${Number(params.patient_id)} Limit 1;`;
});

app.get("/searchbyName/:name", async ({params}) => {
  return await db.$queryRaw`SELECT patient_id, name, phone_number, birthday, gender, appoinment_date, course_count FROM "patient" WHERE LOWER(replace("name", ' ', '')) LIKE '%' || LOWER(${params.name}) || '%'; `;
});



app.get("/getPatientList", async () => {
  return await db.$queryRaw`SELECT patient_id, name, phone_number, birthday, gender, appoinment_date, course_count FROM "patient";`;
});

app.post("/addPatient", async ({body}) => {
  const { name, phone_number, birthday, gender, appoinment_date, course_count } = body;

  const result = await db.$queryRaw`
    INSERT INTO "patient" 
    ( "name", phone_number, birthday, gender, appoinment_date, course_count) 
    VALUES (${name}, ${phone_number}, ${birthday}, ${gender}, ${appoinment_date}, ${course_count});
  `;
  
  return { success: true, message: "Patient added successfully", result };
},{body:t.Object({
  name:t.String({minLength:1, maxLength:50}), phone_number:t.String({minLength:10, maxLength:10}), birthday:t.Date(), gender:t.String({minLength:1, maxLength:10}), appoinment_date:t.Date(), course_count:t.Integer({minimum: 0, maximum: 10}) 
})});


export default app;