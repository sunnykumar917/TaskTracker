import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    tasksToDo: 0,
    tasksInProgress: 0,
    tasksCompleted: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get("http://localhost:5000/tasks");
      const userFromLS = JSON.parse(localStorage.getItem("user"))
      console.log(userFromLS)
      const tasks = response.data.filter(
        (task) =>
          task.assignee === userFromLS.username

      );

      const totalTasks = tasks.length;
      const tasksToDo = tasks.filter((task) => task.status === "ToDo").length;
      const tasksInProgress = tasks.filter((task) => task.status === "InProgress").length;
      const tasksCompleted = tasks.filter((task) => task.status === "Done").length;

      setStats({
        totalTasks,
        tasksToDo,
        tasksInProgress,
        tasksCompleted,
      });
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const chartData = {
    labels: ["To Do", "In Progress", "Completed"],
    datasets: [
      {
        label: "Task Count",
        data: [stats.tasksToDo, stats.tasksInProgress, stats.tasksCompleted],
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Task Count",
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.keys(stats).map((key) => (
          <div key={key} className="bg-white shadow p-4 rounded-lg">
            <h3 className="text-lg font-medium">{key.replace(/([A-Z])/g, " $1")}</h3>
            <p className="text-2xl font-bold mt-2">{stats[key]}</p>
          </div>
        ))}
      </div>

      <div className="bg-white shadow p-6 rounded-lg">
        <h3 className="text-xl font-medium mb-4">Task Overview</h3>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default DashboardOverview;