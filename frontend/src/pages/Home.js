import React from "react";
import { useEffect, useState } from "react";

// components
import WorkoutDetails from "../components/WorkoutDetails";
import WorkoutForm from "../components/WorkoutForm";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext"

const Home = () => {
  // const [workouts, setWorkouts] = useState(null);
  const { workouts, dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();
  const [selectedWorkout, setSelectedWorkout] = useState(null); // New state to store selected workout

  useEffect(() => {
    const fetchWorkouts = async () => {
      const response = await fetch("/api/workouts", {
        headers: {
          "Authorization": `Bearer ${user.token}`
        }
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_WORKOUTS", payload: json });
      }
    };

    if (user) {
      fetchWorkouts();
    }
  }, [dispatch, user]);

  // const handleEdit = async (workoutId, updatedData) => {
  //   // try {
  //   //   workouts &&
  //   //     workouts.forEach(async (work) => {
  //   //       const response = await fetch("/api/workouts/" + work._id, {
  //   //         method: "PATCH",
  //   //         body: JSON.stringify(work),
  //   //         headers: {
  //   //           "content-type": "application/json",
  //   //         },
  //   //       });
  //   //       console.log(response.status);

  //   //       // const responseText = await response.text();
  //   //       // console.log("Response Text: ", responseText);

  //   //       if (response.ok) {
  //   //         const updatedWorkout = await response.json();
  //   //         console.log("Updated Workout: ", updatedWorkout);
  //   //         dispatch({ type: "UPDATE_WORKOUT", payload: updatedWorkout });
  //   //       }
  //   //     });

  //   const workoutToEdit = workouts.find((workout) => workout._id === workoutId);
  //   setSelectedWorkout(workoutToEdit);

  //   try {
  //     const response = await fetch("/api/workouts/" + workout._id, {
  //       method: "PATCH",
  //       body: JSON.stringify(updatedData),
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     if (response.ok) {
  //       const updatedWorkouts = workouts.map((workout) =>
  //       workout._id === workoutId ? { ...workout, ...updatedData } : workout
  //     );
  //       dispatch({ type: "UPDATE_WORKOUT", payload: updatedWorkouts });
  //     }
  //   } catch (error) {
  //     console.error("Error: ", error);
  //   }
  // };

  const handleEdit = async (workout) => {
    try {
      const response = await fetch("/api/workouts/" + workout._id, {
        headers: {
          "Authorization": `Bearer ${user.token}`
        }
    });

      const updateWorkout = await response.json();
      if (response.ok) {
        // console.log("Selected Workout of Home Page: ", updateWorkout);
        
        setSelectedWorkout(updateWorkout);
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  

  return (
    <div className="home">
      <div className="workouts">
        {workouts &&
          workouts.map((workout) => (
            <WorkoutDetails
              key={workout._id}
              workout={workout}
              handleEdit={handleEdit}
            />
          ))}
      </div>
      <WorkoutForm selectedWorkout={selectedWorkout} />
    </div>
  );
};

export default Home;
