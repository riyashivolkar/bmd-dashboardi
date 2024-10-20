// Function to create a new task in Firestore and send email
const createTask = async (newTask) => {
  try {
    const tasksCollection = collection(db, "formSubmissions");
    const taskDocRef = await addDoc(tasksCollection, newTask);

    // After successfully adding the new task, send an email
    const assignedEmployee = employeeMapping[
      newTask.assignedEmployee
    ]?.includes(newTask.service)
      ? newTask.assignedEmployee
      : "unassigned";

    if (assignedEmployee !== "unassigned") {
      sendTaskAssignmentEmail(assignedEmployee, newTask);
    }

    console.log("New task created:", taskDocRef.id);
  } catch (error) {
    console.error("Error creating task:", error);
  }
};
