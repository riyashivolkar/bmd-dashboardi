// TaskDate.js
const TaskDate = ({ timestamp }) => {
  // Helper function to format the date
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp.seconds * 1000);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year
    return `${day}/${month}/${year}`;
  };

  return <span>{formatDate(timestamp)}</span>;
};

export default TaskDate;
