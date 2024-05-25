import React from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";

// date fns for formatting the date
import formatDistanceToNow from "date-fns/formatDistanceToNow";

const WorkoutDetails = ({ workout, handleEdit }) => {
  const { dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();

  const handleClick = async () => {
    if (!user) {
      console.log("Authorization Required")
      return
    }

    const response = await fetch("/api/workouts/" + workout._id, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${user.token}`
      }
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "DELETE_WORKOUT", payload: json });
    }
  };

  const handleEditClick = () => {
    // Call the handleEdit function passed from the parent
    handleEdit(workout);
    // console.log("hsgddi",handleEdit)
  };

  return (
    <div className="workout-details">
      <h4>{workout.title}</h4>
      <p>
        <strong>Load (kg): </strong>
        {workout.load}
      </p>
      <p>
        <strong>Reps: </strong>
        {workout.reps}
      </p>
      <p>
        {formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}
      </p>
      <div className="delete-edit-btn">
        <span className="material-symbols-outlined" onClick={handleClick}>
          Delete
        </span>
        <br />
        <span
          className="material-symbols-outlined hover-color"
          onClick={handleEditClick}
        >
          Edit
        </span>
      </div>
    </div>
  );
};

export default WorkoutDetails;
