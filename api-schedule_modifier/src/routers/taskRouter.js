import express from "express";
const router = express.Router();
import {
  deleteTask,
  getTasks,
  insertTask,
  updateTask,
} from "../models/taskModel/TaskSchema.js";
// router.all("/", (req, res, next) => {
//   //Do your code
//   //   res.json({
//   //     status: "success",
//   //     message: "response from all",
//   //   });
//   next();
// });

//Database table selecting

/*1. model() function creates a model based on the schema you define.
2. A model in Mongoose is a compiled version of the schema, which represents the structure of documents within a MongoDB collection. It provides an interface to interact with the database, allowing you to create, read, update, and delete documents.*/
router.post("/", async (req, res, next) => {
  try {
    //insert task
    const result = await insertTask(req.body);
    console.log(result);

    result?._id
      ? res.json({
          status: "success",
          message: "New task been added successfully",
        })
      : res.json({
          status: "Failure",
          message: "Unable to add the task. Try again later",
        });
  } catch (error) {
    console.log(error.message);
    res.json({
      status: "error",
      message: error.message,
    });
  }
});
router.get("/", async (req, res, next) => {
  //Do your code
  //db.collection.find
  const tasks = await getTasks();

  res.json({
    status: "success",
    message: "Here are the Task List",
    tasks,
  });
});

router.patch("/", async (req, res, next) => {
  try {
    const { _id, ...rest } = req.body;

    const result = await updateTask(_id, rest);
    result?._id
      ? res.json({
          status: "success",
          message: "Your task has been updated",
        })
      : res.json({
          status: "error",
          message: "Unable to update the task. Try again later",
        });
  } catch (error) {
    res.json({
      status: "error",
      message: error.message,
    });
  }
});
router.delete("/", async (req, res, next) => {
  //Do your code
  try {
    console.log(req.body);

    const result = await deleteTask(req.body);
    console.log(result);
    result?.deletedCount
      ? res.json({
          status: "success",
          message: "Your task has been DELETED",
          result,
        })
      : res.json({
          status: "Error",
          message: "Your task could NOT be DELETED. TRY again Later",
          result,
        });
  } catch (error) {
    res.json({
      status: "error",
      message: error.message,
    });
  }
});

export default router;
