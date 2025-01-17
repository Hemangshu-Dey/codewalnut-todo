import dotenv from "dotenv";
import { dbConnect } from "./dbConnect/dbConnect.js";
import { DBRETRIES } from "./constants.js";
import { app } from "./app.js";

dotenv.config();

await (async () => {
  let retries = DBRETRIES;
  while (retries > 0) {
    try {
      console.log("Trying to connect to database");
      await dbConnect();
      break;
    } catch (error) {
      if (!retries) process.exit(1);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    retries--;
  }
})();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
