const TaskOverview = () => {
  const overviewData = {
    assigned: 15,
    inProgress: 10,
    completed: 20,
  };

  return (
    <div>
      <p>Assigned: {overviewData.assigned}</p>
      <p>In Progress: {overviewData.inProgress}</p>
      <p>Completed: {overviewData.completed}</p>
    </div>
  );
};

export default TaskOverview;
