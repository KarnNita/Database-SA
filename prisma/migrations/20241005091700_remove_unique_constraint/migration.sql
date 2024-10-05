/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "patient" (
    "name" VARCHAR(50) NOT NULL,
    "phone_number" VARCHAR(10) NOT NULL,
    "birthday" DATE NOT NULL,
    "gender" VARCHAR(10) NOT NULL,
    "appoinment_date" TIMESTAMP(0) NOT NULL,
    "course_count" INTEGER NOT NULL,
    "patient_id" SERIAL NOT NULL,

    CONSTRAINT "patient_pkey" PRIMARY KEY ("patient_id")
);

-- CreateTable
CREATE TABLE "staff" (
    "username" VARCHAR(50) NOT NULL,
    "staff_name" VARCHAR(50) NOT NULL,
    "birthday" DATE NOT NULL,
    "gender" VARCHAR(10) NOT NULL,
    "staff_phone_number" VARCHAR(10) NOT NULL,
    "role" VARCHAR(10) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "staff_id" SERIAL NOT NULL,

    CONSTRAINT "staff_pkey" PRIMARY KEY ("staff_id")
);

-- CreateTable
CREATE TABLE "medicalrecords" (
    "record_id" SERIAL NOT NULL,
    "symptoms" VARCHAR(50) NOT NULL,
    "cost" INTEGER NOT NULL DEFAULT 0,
    "appointment_date" TIMESTAMP(6) NOT NULL,
    "doctorid" INTEGER NOT NULL,
    "patientid" INTEGER NOT NULL,
    "staffid" INTEGER NOT NULL,
    "treatment_id" INTEGER NOT NULL,

    CONSTRAINT "medicalrecords_pkey" PRIMARY KEY ("record_id")
);

-- CreateTable
CREATE TABLE "equipment" (
    "equipment_id" SERIAL NOT NULL,
    "equipment_name" VARCHAR(20) NOT NULL,
    "price" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "equipment_pkey" PRIMARY KEY ("equipment_id")
);

-- CreateTable
CREATE TABLE "financialrecords" (
    "financial_record_id" SERIAL NOT NULL,
    "record_date" TIMESTAMP(6) NOT NULL,
    "income_and_expenses" VARCHAR(10) NOT NULL,
    "cost" INTEGER NOT NULL,
    "staff_id" INTEGER NOT NULL,

    CONSTRAINT "financialrecords_pkey" PRIMARY KEY ("financial_record_id")
);

-- CreateTable
CREATE TABLE "requisition" (
    "requisition_id" SERIAL NOT NULL,
    "use_amount" INTEGER NOT NULL,
    "requisition_date" TIMESTAMP(6) NOT NULL,
    "equipment_id" INTEGER NOT NULL,
    "staff_id" INTEGER NOT NULL,

    CONSTRAINT "requisition_pkey" PRIMARY KEY ("requisition_id")
);

-- CreateTable
CREATE TABLE "stockinrecord" (
    "stock_in_id" SERIAL NOT NULL,
    "stock_in_date" TIMESTAMP(6) NOT NULL,
    "equipment_id" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "staff_id" INTEGER NOT NULL,

    CONSTRAINT "stockinrecord_pkey" PRIMARY KEY ("stock_in_id")
);

-- CreateTable
CREATE TABLE "treatmenttype" (
    "treatment_id" SERIAL NOT NULL,
    "cost" INTEGER NOT NULL,
    "treatment_name" VARCHAR(20) NOT NULL,

    CONSTRAINT "treatmenttype_pkey" PRIMARY KEY ("treatment_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "staff_username_key" ON "staff"("username");

-- CreateIndex
CREATE INDEX "medicalrecords_doctorid_idx" ON "medicalrecords"("doctorid");

-- CreateIndex
CREATE INDEX "medicalrecords_staffid_idx" ON "medicalrecords"("staffid");

-- AddForeignKey
ALTER TABLE "medicalrecords" ADD CONSTRAINT "medicalrecords_doctorid_fkey" FOREIGN KEY ("doctorid") REFERENCES "staff"("staff_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicalrecords" ADD CONSTRAINT "medicalrecords_patientid_fkey" FOREIGN KEY ("patientid") REFERENCES "patient"("patient_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "medicalrecords" ADD CONSTRAINT "medicalrecords_staffid_fkey" FOREIGN KEY ("staffid") REFERENCES "staff"("staff_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicalrecords" ADD CONSTRAINT "medicalrecords_treatment_id_fkey" FOREIGN KEY ("treatment_id") REFERENCES "treatmenttype"("treatment_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "financialrecords" ADD CONSTRAINT "financialrecords_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("staff_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "requisition" ADD CONSTRAINT "requisition_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "equipment"("equipment_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "requisition" ADD CONSTRAINT "requisition_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("staff_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stockinrecord" ADD CONSTRAINT "stockinrecord_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "equipment"("equipment_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stockinrecord" ADD CONSTRAINT "stockinrecord_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("staff_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
