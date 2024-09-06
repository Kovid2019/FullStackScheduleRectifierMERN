import express from "express";
import cors from "cors";
const app = express(); //Initialises a new express appln
/* express() is a function exported by the Express module, and when called, it creates an Express application.*/
/*The app object, which is the result of calling express(), represents your Express application and allows you to configure and start your server, define routes, and manage middleware. */
import morgan from "morgan";

//Connect MongoDB
import { connectMongoDb } from "./src/config/dbConfig.js";
connectMongoDb();
const PORT = 8000;

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

//Static serving
import path from "path";
const __dirname = path.resolve();

//Serve the static files from the node.
app.use(express.static(path.join(__dirname, "dist")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});
console.log(__dirname);

import taskRouter from "./src/routers/taskRouter.js";

app.use("/api/v1/tasks", taskRouter);

app.listen(PORT, (error) => {
  error
    ? console.log(error)
    : console.log(`server is running at http://localhost:${PORT}`);
});
