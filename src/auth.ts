import { Elysia } from "elysia";

const app = new Elysia().onRequest(({ request, set }) => {
  const allow_key = JSON.parse(process.env.ALLOW_KEY as string);
  const key = request.headers.get("key");
  //   if (key === null || allow_key[key || ""] !== "true") {
  //     set.status = 301;
  //     return "authen failed";
  //   }

  console.log("request : ", request);
});

export default app;