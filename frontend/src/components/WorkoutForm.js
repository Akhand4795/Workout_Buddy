import React, { useState, useEffect } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";

const WorkoutForm = ({ selectedWorkout }) => {
  const { dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();
  const [title, setTitle] = useState("");
  const [load, setLoad] = useState("");
  const [reps, setReps] = useState("");
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  useEffect(() => {
    if (selectedWorkout) {
      setTitle(selectedWorkout.title);
      setLoad(selectedWorkout.load);
      setReps(selectedWorkout.reps);
    }
  }, [selectedWorkout]);
  //  console.log("Selected Workout of Form Page:", selectedWorkout);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in to view this");
      return;
    }

    const workout = { title, load, reps };

    const response = await fetch("/api/workouts", {
      method: "POST",
      body: JSON.stringify(workout),
      headers: {
        "content-type": "application/json",
        "Authorization": `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields);
    }
    if (response.ok) {
      setTitle("");
      setLoad("");
      setReps("");
      setError(null);
      setEmptyFields([]);
      console.log("New Workout Added successfully", json);
      dispatch({ type: "CREATE_WORKOUT", payload: json });
    }
  };

  const handleEditWorkout = async (e) => {
    e.preventDefault();
    const updatedData = {
      title: title,
      load: load,
      reps: reps,
    };

    // Pass the updated data to the handleEdit function
    try {
      const response = await fetch("/api/workouts/" + selectedWorkout._id, {
        method: "PATCH",
        body: JSON.stringify(updatedData),
        headers: {
          "content-type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
      });
      const json = await response.json();

      if (!response.ok) {
        setError(json.error);
        setEmptyFields(json.emptyFields);
      }

      if (response.ok) {
        setTitle("");
        setLoad("");
        setReps("");
        setError(null);
        setEmptyFields([]);
        console.log("Workout updated successfully!");
        dispatch({ type: "UPDATE_WORKOUT", payload: json });
      }
    } catch (error) {
      console.error("Error updating workout: ", error);
    }
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a new Workout</h3>

      <label>Exercise Title</label>
      <input
        type="text"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        className={emptyFields.includes("title") ? "error" : ""}
      />

      <label>Load (in Kg):</label>
      <input
        type="number"
        onChange={(e) => setLoad(e.target.value)}
        value={load}
        className={emptyFields.includes("load") ? "error" : ""}
      />

      <label>Reps:</label>
      <input
        type="number"
        onChange={(e) => setReps(e.target.value)}
        value={reps}
        className={emptyFields.includes("reps") ? "error" : ""}
      />

      <button>Add Workout</button>
      <button onClick={handleEditWorkout}>Edit Workout</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default WorkoutForm;
