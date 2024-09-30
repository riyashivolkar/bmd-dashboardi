// components/EmployeePerformance.js
const EmployeePerformance = () => {
  const performanceData = [
    { name: "Employee 1", assigned: 5, completed: 3, inProgress: 2 },
    { name: "Employee 2", assigned: 4, completed: 4, inProgress: 0 },
    { name: "Employee 3", assigned: 6, completed: 2, inProgress: 4 },
  ];

  return (
    <div>
      {performanceData.map((employee, index) => (
        <div key={index} className="mb-2">
          <span className="font-bold">{employee.name}:</span>
          <span> Assigned: {employee.assigned} |</span>
          <span> Completed: {employee.completed} |</span>
          <span> In Progress: {employee.inProgress}</span>
        </div>
      ))}
    </div>
  );
};

export default EmployeePerformance;
