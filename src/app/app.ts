import express from "express";
import { NextFunction, Request, Response } from "express";
import { apiRouter } from "./api/api.routes";
import * as swagger from "swagger-express-ts";
const app = express();

// Swagger Implementation Starts Here

app.use("/api-docs/swagger", express.static("swagger"));
app.use(
  "/api-docs/swagger/assets",
  express.static("node_modules/swagger-ui-dist")
);
app.use(
  swagger.express({
    definition: {
      info: {
        title: "My api",
        version: "1.0",
      },
      basePath: "/api/v1",
      schemes: ["http"],
    },
  })
);

// Swagger Implementation Ends Here

app.use("/api/v1", apiRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: "Not Found" });
});

export default app;
