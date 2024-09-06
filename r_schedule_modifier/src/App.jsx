import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Form } from "./components/Form";
import { Table } from "./components/Table";
import {
  deleteTask,
  fetchAllTasks,
  postTask,
  updateTask,
} from "./helpers/axiosHelper";

const hoursPerWeek = 24 * 7;

function App() {
  const [taskList, setTaskList] = useState([]);
  const [resp, setResp] = useState({});
  const shouldFetchRef = useRef(true);
  const ttlHr = taskList.reduce((acc, item) => {
    return acc + +item.hr;
  }, 0);
  const [toDelete, setToDelete] = useState([]);
  const entryList = taskList.filter((item) => item.type === "entry");
  const badList = taskList.filter((item) => item.type === "bad");

  useEffect(() => {
    shouldFetchRef.current && getAllTasks();
    shouldFetchRef.current = false;
  }, []);
  const addTaskList = async (taskObj) => {
    if (ttlHr + +taskObj.hr > hoursPerWeek) {
      return alert("Sorry Bhayya. You are exceeding, hours per week");
    }

    //Call API to send data to the database.
    const response = await postTask(taskObj);
    setResp(response);
    if (response.status === "success") {
      //re fetch all the tasks
      getAllTasks();
    }
  };
  const switchTask = async (_id, type) => {
    const response = await updateTask({ _id, type });
    setResp(response);
    if (response.status === "success") {
      //re fetch all the tasks
      getAllTasks();
    }
  };

  const handleOnDelete = async (idsToDelete) => {
    // console.log(id);
    if (window.confirm("Are you sure, you want to delete this?")) {
      // setTaskList(taskList.filter((item) => item.id !== id));
      //Todo Delete
      const response = await deleteTask(idsToDelete);

      setResp(response);
      if (response.status === "success") {
        //re fetch all the tasks
        getAllTasks();
        //empty the toDelete[]
        setToDelete([]);
      }
    }
  };
  const getAllTasks = async () => {
    //Call the axiosHelper to get data from the server

    const data = await fetchAllTasks();

    //Mount that data to our taskList state.
    data?.status === "success" && setTaskList(data.tasks);
  };

  const handleOnSelect = (e) => {
    const { checked, value } = e.target;

    let tempArg = [];
    if (value === "allEntry") {
      tempArg = entryList;
    }
    if (value === "allBad") {
      tempArg = badList;
    }

    if (checked) {
      if (value === "allEntry" || value === "allBad") {
        //get all _ids from the entry list.
        const _ids = tempArg.map((item) => item._id);
        const uniqueIds = [...new Set([...toDelete, ..._ids])];
        setToDelete(uniqueIds);
        return;
      }
      setToDelete([...toDelete, value]);
    } else {
      if (value === "allEntry" || value === "allBad") {
        const _ids = tempArg.map((item) => item._id);
        const ta = toDelete.filter((_id) => !_ids.includes(_id)); //ta->Temporary Array
        setToDelete(ta);
        return;
      }
      setToDelete(toDelete.filter((_id) => _id !== value));
    }
    console.log(checked, value);
  };
  return (
    <div className="wrapper pt-5">
      {/* <!-- title  --> */}
      <div className="container">
        <h1 className="text-center">Not To Do List!</h1>

        {resp?.message && (
          <div
            className={
              resp?.status === "success"
                ? "alert alert-success"
                : "alert alert-danger"
            }
          >
            {resp?.message}
          </div>
        )}

        {/* <!-- form  --> */}
        <Form addTaskList={addTaskList} />

        {/* <!-- tables --> */}

        <Table
          taskList={taskList}
          switchTask={switchTask}
          handleOnDelete={handleOnDelete}
          toDelete={toDelete}
          handleOnSelect={handleOnSelect}
          entryList={entryList}
          badList={badList}
        />
        <div className="alert alert-success">
          The total hours allocated = <span id="ttlHrs">{ttlHr}</span> hrs
        </div>
      </div>
    </div>
  );
}

export default App;
