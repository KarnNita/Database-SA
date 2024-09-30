import { Elysia } from "elysia";
import patient from "./patient";
import auth from "./auth";
import staff from "./staff";

const app = new Elysia();

app.use(auth);
app.use(patient);
app.use(staff);

app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);