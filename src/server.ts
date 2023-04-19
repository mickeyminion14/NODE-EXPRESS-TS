// import app from "./app/app";
// import compression from "compression";
// import helmet from "helmet";
// import { connect } from "mongoose";

import { Application } from "./app/app";

// const DB_URL =
//   "mongodb+srv://devsarthakagrawal:sarthak12345@cluster0.bmkoglv.mongodb.net/?retryWrites=true&w=majority";

// // connect(DB_URL)
// //   .then(() => {
// //     app.listen(8080, () =>
// //       serverLogger.info("Starting Express server on Port 8080")
// //     );
// //   })
// //   .catch((err) => console.log(err));

try {
  // Initialize Application
  Application.init();
} catch (err: any) {
  // Handle application errors with friendly messages
  console.error(err.message);
}
