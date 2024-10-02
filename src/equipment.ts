import { Elysia } from "elysia";
import db from "./db";
import { password } from "bun";

const app = new Elysia({ prefix: "/equipment" });


export default app;