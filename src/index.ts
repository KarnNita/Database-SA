import { Elysia } from "elysia";
import auth from "./auth";
import patient from "./patient";
import staff from "./staff";
import equipment from "./equipment";
import treatmenttype  from "./treatmentType";
import stockinrecord  from "./stockInRecord";
import requisition from "./requisition"
import medicalrecords from "./medicalRecords"
import financialrecords from "./financialRecords"
import cors from "./cors"
import { swagger } from '@elysiajs/swagger'

const app = new Elysia();

app.use(
  swagger({
    path: "/docs",
    documentation: {
      info: { title: "Medical Api Document", version: "1.0.0" },
      tags: [
        { name: "Equipment", description: "Equipment endpoint" },
        { name: "Patient", description: "Patient endpoint" },
        { name: "Staff", description: "Staff endpoint" },
        { name: "TreatmentType", description: "TreatmentType endpoint" },
        { name: "StockInRecord", description: "StockInRecord endpoint" },
        { name: "Requisition", description: "Requisition endpoint" },
        { name: "MedicalRecords", description: "MedicalRecords endpoint" },
        { name: "FinancialRecords", description: "FinancialRecords endpoint" },
      ],
    },
  })
);

app.use(cors);
app.use(auth);
app.use(patient);
app.use(staff);
app.use(equipment);
app.use(treatmenttype);
app.use(stockinrecord);
app.use(requisition);
app.use(medicalrecords);
app.use(financialrecords);


app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);