import { Elysia, t } from "elysia";
import db from "./db";
import { password } from "bun";

const app = new Elysia({ prefix: "/patient", detail: { tags: ["Patient"] } });

app.get("/searchbyID/:patient_id", async ({ params }) => {
  return await db.$queryRaw`SELECT patient_id, name_surname, phone_number, birthday, gender, appointment_date, course_count, first_visit_date FROM "patient" WHERE "patient_id" = ${Number(
    params.patient_id
  )} Limit 1;`;
});

app.get("/searchbyName/:name_surname", async ({ params }) => {
  return await db.$queryRaw`SELECT patient_id, name_surname, phone_number, birthday, gender, appointment_date, course_count, first_visit_date FROM "patient" WHERE LOWER(replace("name_surname", ' ', '')) LIKE '%' || LOWER(${params.name_surname}) || '%'; `;
});

app.get("/getPatientList", async () => {
  return await db.$queryRaw`SELECT patient_id, name_surname, phone_number, birthday, gender, appointment_date, course_count, first_visit_date FROM "patient";`;
});

app.get("/getNamebyID/:patient_id", async ({ params }) => {
  return await db.$queryRaw`SELECT name_surname FROM "patient" WHERE "patient_id" = ${Number(
    params.patient_id
  )} LIMIT 1;`;
});

app.post(
  "/addPatient",
  async ({ body }) => {
    const {
      name_surname,
      phone_number,
      birthday,
      gender,
      appointment_date,
      course_count,
      first_visit_date,
    } = body;

    const result = await db.$queryRaw`
    INSERT INTO "patient" 
    ( "name_surname", phone_number, birthday, gender, appointment_date, course_count, first_visit_date) 
    VALUES (${name_surname}, ${phone_number}, ${birthday}, ${gender}, ${appointment_date}, ${course_count}, ${first_visit_date});
  `;

    return { success: true, message: "Patient added successfully", result };
  },
  {
    body: t.Object({
      name_surname: t.String({ minLength: 1, maxLength: 50 }),
      phone_number: t.String({ minLength: 10, maxLength: 10 }),
      birthday: t.Date(),
      gender: t.String({ minLength: 1, maxLength: 10 }),
      appointment_date: t.Date(),
      course_count: t.Integer({ minimum: 0, maximum: 10 }),
      first_visit_date: t.Date(),
    }),
  }
);

app.post(
  "/editPatient/:patient_id",
  async ({ body }) => {
    const {
      patient_id,
      name_surname,
      phone_number,
      birthday,
      gender,
      appointment_date,
      course_count,
      first_visit_date,
    } = body;

    const result = await db.$queryRaw`
    UPDATE "patient"  SET
    "name_surname" = ${name_surname} , phone_number = ${phone_number}, birthday = ${birthday}, gender = ${gender}, appointment_date = ${appointment_date}, course_count = ${course_count}, first_visit_date = ${first_visit_date}
    WHERE "patient_id"  = ${patient_id}
  `;
    return "Work";
  },
  {
    body: t.Object({
      patient_id: t.Integer({ minimum: 0, maximum: 9999 }),
      name_surname: t.String({ minLength: 1, maxLength: 50 }),
      phone_number: t.String({ minLength: 10, maxLength: 10 }),
      birthday: t.Date(),
      gender: t.String({ minLength: 1, maxLength: 10 }),
      appointment_date: t.Date(),
      course_count: t.Integer({ minimum: 0, maximum: 10 }),
      first_visit_date: t.Date(),
    }),
  }
);

app.post(
  "/editAppoinmentDate/:patient_id",
  async ({ body }) => {
    const { patient_id, appointment_date } = body;

    const result = await db.$queryRaw`
      UPDATE "patient"
      SET appointment_date = ${appointment_date}
      WHERE "patient_id" = ${patient_id};
    `;

    return {
      success: true,
      message: "Appointment Date updated successfully",
    };
  },
  {
    body: t.Object({
      patient_id: t.Integer({ minimum: 0, maximum: 9999 }),
      appointment_date: t.Date(),
    }),
  }
);

interface PatientCountResult {
  patient_count: number;  
}


app.post(
  "/countByDate",
  async ({ body }) => {
    const { appointment_date } = body;

    const result = await db.$queryRaw<PatientCountResult[]>`
      SELECT COUNT(appointment_date) as patient_count
      FROM "patient"
      WHERE "appointment_date"::date = ${appointment_date}::date;
    `;

    return {
      success: true,
      count: result[0].patient_count.toString(),
    };
  },
  {
    body: t.Object({
      appointment_date: t.String(), 
    }),
  }
);



export default app;
