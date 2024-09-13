import React, { useState } from 'react';

const DailyAttendance = () => {
  const [selectedEmployees, setSelectedEmployees] = useState('All Employees');
  const [date, setDate] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);

  // Sample employee list (replace later with data from API)
  const employees = ['John Doe', 'Jane Smith', 'Michael Johnson'];

  // Handle "Get Employees List" button
  const getEmployeesList = () => {
    const filteredEmployees = selectedEmployees === 'All Employees' ? employees : [selectedEmployees];
    const attendance = filteredEmployees.map((emp) => ({
      name: emp,
      status: 'Present',
    }));
    setAttendanceData(attendance);
  };

  // Handle status change for each employee
  const handleStatusChange = (index, status) => {
    const updatedAttendance = [...attendanceData];
    updatedAttendance[index].status = status;
    setAttendanceData(updatedAttendance);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h3 className="text-xl font-bold mb-4">Daily Attendance</h3>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium">Select Employees</label>
          <select
            className="w-full mt-2 p-2 border border-gray-300 rounded"
            value={selectedEmployees}
            onChange={(e) => setSelectedEmployees(e.target.value)}
          >
            <option>All Employees</option>
            {employees.map((employee, index) => (
              <option key={index} value={employee}>
                {employee}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Select Date</label>
          <input
            type="date"
            className="w-full mt-2 p-2 border border-gray-300 rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded"
            onClick={getEmployeesList}
          >
            Get Employees List
          </button>
        </div>
      </div>

      {attendanceData.length > 0 && (
        <>
          <table className="min-w-full table-auto border-collapse border border-gray-300 mt-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Employee Name</th>
                <th className="border border-gray-300 px-4 py-2">Date</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((employee, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">{employee.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{date}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <select
                      className="p-2 border border-gray-300 rounded"
                      value={employee.status}
                      onChange={(e) => handleStatusChange(index, e.target.value)}
                    >
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="bg-green-500 text-white py-2 px-4 rounded mt-4">
            Submit Attendance
          </button>
        </>
      )}
    </div>
  );
};

export default DailyAttendance;
