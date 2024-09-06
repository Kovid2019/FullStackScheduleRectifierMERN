/* eslint-disable react/prop-types */
// import React from "react"
import { useState } from "react";

export const Form = ({ addTaskList }) => {
  const [form, setForm] = useState({});
  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value, //
    });
  };
  const handleOnSubmit = (e) => {
    e.preventDefault();
    addTaskList(form);
  };

  return (
    <form
      onSubmit={handleOnSubmit}
      className="border p-5 rounded shadow-lg mt-5"
    >
      <div className="row g-2">
        <div className="col-md-7">
          <input
            type="text"
            className="form-control"
            placeholder="Task"
            aria-label="First name"
            name="task"
            id="task"
            onChange={handleOnChange}
            required
          />
        </div>
        <div className="col-md-2">
          <input
            type="number"
            className="form-control"
            placeholder="40"
            aria-label="Last name"
            name="hr"
            min="1"
            max="100"
            onChange={handleOnChange}
            required
          />
        </div>
        <div className="col-md-3 d-grid">
          <button className="btn btn-primary">Add New Task</button>
        </div>
      </div>
    </form>
  );
};
