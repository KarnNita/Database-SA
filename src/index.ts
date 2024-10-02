import { Elysia } from "elysia";
import patient from "./patient";
import auth from "./auth";
import staff from "./staff";
import equipment from "./equipment";
import cors from "./cors"

const app = new Elysia();

app.use(cors);
app.use(auth);
app.use(patient);
app.use(staff);
app.use(equipment);


app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);