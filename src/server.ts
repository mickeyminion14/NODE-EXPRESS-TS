import app from "./app/app";
import compression from "compression";
import helmet from "helmet";
import { connect } from "mongoose";
import { serverLogger } from "./app/utils/logger";

const DB_URL =
  "mongodb+srv://devsarthakagrawal:sarthak12345@cluster0.bmkoglv.mongodb.net/?retryWrites=true&w=majority";

app.use(helmet()); // set well-known security-related HTTP headers
app.use(compression());

app.disable("x-powered-by");

connect(DB_URL)
  .then(() => {
    app.listen(8080, () =>
      serverLogger.info("Starting Express server on Port 8080")
    );
  })
  .catch((err) => console.log(err));
