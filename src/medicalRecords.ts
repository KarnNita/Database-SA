import { Elysia, t } from "elysia";
import db from "./db";
import { password } from "bun";

const app = new Elysia({ prefix: "/medicalrecords", detail: {tags: ["MedicalRecords"]} });

app.get("/getMedicalRecordsList", async () => {
    return await db.$queryRaw`SELECT record_id, symptoms, cost, appointment_date, doctorid, patientid, staffid,treatment_id FROM "medicalrecords";`;
  });

app.get("/searchbyID/:record_id", async ({ params }) => {
    return await db.$queryRaw`SELECT record_id, symptoms, cost, appointment_date, doctorid, patientid, staffid,treatment_id FROM "medicalrecords" WHERE "record_id" = ${Number(params.record_id)} LIMIT 1;`;
});

app.get("/searchbyDoctorID/:doctorid", async ({ params }) => {
  return await db.$queryRaw`SELECT record_id, symptoms, cost, appointment_date, doctorid, patientid, staffid,treatment_id FROM "medicalrecords" WHERE "doctorid" = ${Number(params.doctorid)};`;
});

app.get("/searchbyStaffID/:staffid", async ({ params }) => {
  return await db.$queryRaw`SELECT record_id, symptoms, cost, appointment_date, doctorid, patientid, staffid,treatment_id FROM "medicalrecords" WHERE "staffid" = ${Number(params.staffid)};`;
});

app.get("/searchbyPatientID/:patientid", async ({ params }) => {
  return await db.$queryRaw`SELECT record_id, symptoms, cost, appointment_date, doctorid, patientid, staffid,treatment_id FROM "medicalrecords" WHERE "patientid" = ${Number(params.patientid)};`;
});

app.post("/addRecord", async ({body}) => {
  const { symptoms, cost, appointment_date, doctorid, patientid, staffid, treatment_id } = body;

  const result = await db.$queryRaw`
    INSERT INTO "medicalrecords" 
    (symptoms, cost, appointment_date, doctorid, patientid, staffid,treatment_id) 
    VALUES (${symptoms}, ${cost}, ${appointment_date}, ${doctorid}, ${patientid}, ${staffid}, ${treatment_id});
  `;
  
  return { success: true, message: "Patient added successfully", result };
},{body:t.Object({
  symptoms:t.String({minLength:1, maxLength:100}), cost:t.Integer({minimum: 0}), appointment_date:t.Date(), doctorid:t.Integer(),  patientid:t.Integer(), staffid:t.Integer(), treatment_id:t.Integer()}) 
});// not work

export default app;