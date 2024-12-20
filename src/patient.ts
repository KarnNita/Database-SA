import { Elysia, t } from "elysia";
import db from "./db";
import { password } from "bun";

const app = new Elysia({ prefix: "/patient", detail: { tags: ["Patient"] } });

interface Patient {
  patient_id: number;
  name_surname: string;
  phone_number: string;
  birthday: Date;
  gender: string;
  appointment_date: Date | null;
  course_count: number;
  first_visit_date: Date;
}

interface PatientCountResult {
  patient_count: number;
}

app.get("/searchbyID/:patient_id", async ({ params }) => {
  return await db.$queryRaw`SELECT patient_id, name_surname, phone_number, birthday, gender, appointment_date, course_count, first_visit_date FROM "patient" WHERE "patient_id" = ${Number(params.patient_id)} LIMIT 1;`;
});

app.get("/searchbyName/:name_surname", async ({ params }) => {
  return await db.$queryRaw`SELECT patient_id, name_surname, phone_number, birthday, gender, appointment_date, course_count, first_visit_date FROM "patient" WHERE LOWER(replace("name_surname", ' ', '')) LIKE '%' || LOWER(${params.name_surname}) || '%';`;
});

app.get("/searchbyAppointmentDate/:appointment_date", async ({ params }) => {
  const { appointment_date } = params;
  return await db.$queryRaw`
    SELECT patient_id, name_surname, phone_number, birthday, gender, appointment_date, course_count, first_visit_date 
    FROM "patient" 
    WHERE "appointment_date" = ${appointment_date}::timestamp;
  `;
});

app.get("/getPatientList", async () => {
  return await db.$queryRaw`SELECT patient_id, name_surname, phone_number, birthday, gender, appointment_date, course_count, first_visit_date FROM "patient";`;
});

app.get("/getNamebyID/:patient_id", async ({ params }) => {
  return await db.$queryRaw`SELECT name_surname FROM "patient" WHERE "patient_id" = ${Number(params.patient_id)} LIMIT 1;`;
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
      ("name_surname", phone_number, birthday, gender, appointment_date, course_count, first_visit_date) 
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
      appointment_date: t.Optional(t.Date()),
      course_count: t.Integer({ minimum: 0, maximum: 10 }),
      first_visit_date: t.Date(),
    }),
  }
);

app.post(
  "/editPatient",
  async ({ body }: { body: Patient }) => {
    try {
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

      await db.$queryRaw`
        UPDATE "patient"
        SET
          "name_surname" = ${name_surname},
          "phone_number" = ${phone_number},
          "birthday" = ${birthday},
          "gender" = ${gender},
          "appointment_date" = ${appointment_date},
          "course_count" = ${course_count},
          "first_visit_date" = ${first_visit_date}
        WHERE "patient_id" = ${patient_id};
      `;

      return { success: true, message: "Patient updated successfully" };
    } catch (error: any) {
      return {
        success: false,
        error: "Error while editing patient data",
        details: error.message,
      };
    }
  },
  {
    body: t.Object({
      patient_id: t.Integer({ minimum: 0 }),
      name_surname: t.String({ minLength: 1, maxLength: 50 }),
      phone_number: t.String({ minLength: 10, maxLength: 10 }),
      birthday: t.Date(),
      gender: t.String({ minLength: 1, maxLength: 10 }),
      appointment_date: t.Optional(t.Date()),
      course_count: t.Integer({ minimum: 0, maximum: 10 }),
      first_visit_date: t.Date(),
    }),
  }
);

app.post(
  "/editAppoinmentDate",
  async ({ body }) => {
    const { patient_id, appointment_date } = body;

    await db.$queryRaw`
      UPDATE "patient"
      SET "appointment_date" = ${appointment_date}
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
      appointment_date: t.Optional(t.Date()),
    }),
  }
);

app.post(
  "/countByDate",
  async ({ body }) => {
    const { appointment_date } = body;
    console.log("Received appointment_date:", appointment_date); 

    try {
      const result = await db.$queryRaw<PatientCountResult[]>`
        SELECT COUNT(appointment_date) as patient_count
        FROM "patient"
        WHERE "appointment_date"::date = ${appointment_date}::date;
      `;
      console.log("Query result:", result); 

      return {
        success: true,
        count: result[0]?.patient_count.toString() || "0",
      };
    } catch (error) {
      console.error("Query error:", error);
      return { success: false, error: "Database query failed" };
    }
  },
  {
    body: t.Object({
      appointment_date: t.String(),
    }),
  }
);

app.post(
  "/setCourseCountToNine",
  async ({ body }) => {
    const { patient_id } = body;

    try {
      await db.$queryRaw`
        UPDATE "patient"
        SET "course_count" = 9
        WHERE "patient_id" = ${patient_id};
      `;

      return { success: true, message: "Course count set to 9 successfully" };
    } catch (error: any) {
      return {
        success: false,
        error: "Error while setting course count",
        details: error.message,
      };
    }
  },
  {
    body: t.Object({
      patient_id: t.Integer({ minimum: 0 }),
    }),
  }
);

app.post(
  "/decreaseCourseCount",
  async ({ body }) => {
    const { patient_id } = body;

    try {
      const existingPatient = await db.$queryRaw<Patient[]>`
        SELECT "course_count" FROM "patient" WHERE "patient_id" = ${patient_id};
      `;

      if (existingPatient.length === 0) {
        return {
          success: false,
          error: "Patient not found",
        };
      }

      const currentCount = existingPatient[0].course_count;

      if (currentCount > 0) {
        await db.$queryRaw`
          UPDATE "patient"
          SET "course_count" = "course_count" - 1
          WHERE "patient_id" = ${patient_id};
        `;
        return { success: true, message: "Course count decreased by 1" };
      } else {
        return { success: false, message: "Course count is already at 0" };
      }
    } catch (error: any) {
      return {
        success: false,
        error: "Error while decreasing course count",
        details: error.message,
      };
    }
  },
  {
    body: t.Object({
      patient_id: t.Integer({ minimum: 0 }),
    }),
  }
);


export default app;
