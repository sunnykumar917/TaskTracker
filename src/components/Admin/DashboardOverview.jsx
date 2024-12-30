import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    developers: 0,
    totalTasks: 0,
    tasksCompleted: 0,
    tasksPending: 0,
    tasksToDo: 0,
  });
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [error, setError] = useState(null);

  const barChartData = [
    { name: "To Do", value: stats.tasksToDo },
    { name: "In Progress", value: stats.tasksPending },
    { name: "Completed", value: stats.tasksCompleted },
  ];

  useEffect(() => {
    const fetchStats = () => {
      fetch("http://localhost:5000/tasks")
        .then((res) => res.json())
        .then((data) => {
          setTasks(data);
          updateStats(data);
          setLoadingStats(false);
        })
        .catch(() => {
          setError("Failed to load tasks.");
          setLoadingStats(false);
        });
    };

    const fetchUsers = () => {
      fetch("http://localhost:5000/users")
        .then((res) => res.json())
        .then((data) => {
          setUsers(data);
          updateDeveloperCount(data);
        })
        .catch(() => {
          setError("Failed to load users.");
        });
    };

    const fetchRecentActivities = () => {
      fetch("http://localhost:5000/recentActivities")
        .then((res) => res.json())
        .then((data) => {
          setRecentActivities(data);
          setLoadingActivities(false);
        })
        .catch(() => {
          setError("Failed to load recent activities.");
          setLoadingActivities(false);
        });
    };

    fetchStats();
    fetchUsers();
    fetchRecentActivities();

    const intervalId = setInterval(() => {
      fetchStats();
      fetchRecentActivities();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const updateStats = (tasks) => {
    let tasksCompleted = 0;
    let tasksPending = 0;
    let tasksToDo = 0;

    tasks.forEach((task) => {
      if (task.status === "Done") {
        tasksCompleted += 1;
      } else if (task.status === "InProgress") {
        tasksPending += 1;
      } else if (task.status === "ToDo") {
        tasksToDo += 1;
      }
    });

    setStats((prevStats) => ({
      ...prevStats,
      totalTasks: tasks.length,
      tasksCompleted,
      tasksPending,
      tasksToDo,
    }));
  };

  const updateDeveloperCount = (users) => {
    const developerCount = users.filter((user) => user.role === "developer").length;
    setStats((prevStats) => ({
      ...prevStats,
      developers: developerCount,
    }));
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Dashboard Summary */}
      <div className="row g-4">
        {loadingStats ? (
          <p className="col-12 text-center text-gray-500">Loading stats...</p>
        ) : (
          <>
            <StatCard title="Developers" value={stats.developers} />
            <StatCard title="Total Tasks" value={stats.totalTasks} />
            <StatCard title="Tasks Completed" value={stats.tasksCompleted} />
            <StatCard title="Tasks Pending" value={stats.tasksPending + stats.tasksToDo} />
          </>
        )}
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded shadow p-4">
        <h3 className="text-xl font-semibold mb-4">Recent Activities</h3>
        {loadingActivities ? (
          <p className="text-center text-gray-500">Loading activities...</p>
        ) : error ? (
          <p className="text-center text-danger">{error}</p>
        ) : (
          <table className="table table-hover">
            <thead className="table-dark">
              <tr>
                <th>Activity</th>
                <th>User</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <tr key={index}>
                    <td>{activity.description}</td>
                    <td>{activity.user}</td>
                    <td>{new Date(activity.time).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-500">
                    No recent activities found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Task Status Overview (Bar Chart) */}
      <div className="bg-white rounded shadow p-4">
        <h3 className="text-xl font-semibold mb-4">Task Status Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barChartData} barSize={40}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="value"
              fill="#0d6efd"
              radius={[10, 10, 0, 0]}
              label={{ position: "top", fill: "#000", fontSize: 12 }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="col-lg-3 col-md-4 col-sm-6">
    <div className="card shadow-sm border-0 text-center">
      <div className="card-body">
        <h5 className="card-title text-primary">{title}</h5>
        <p className="card-text display-6 fw-bold">{value}</p>
      </div>
    </div>
  </div>
);

export default DashboardOverview;
