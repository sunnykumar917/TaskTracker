import React, { useState, useEffect } from "react";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [newUser, setNewUser] = useState({ name: "", username: "", email: "", password: "" });
  const [passwordUpdate, setPasswordUpdate] = useState({ username: "", newPassword: "" });
  const [notification, setNotification] = useState("");
  const [error, setError] = useState("");
  const [showAddDeveloper, setShowAddDeveloper] = useState(false);
  const [showUpdatePassword, setShowUpdatePassword] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/users");
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000);
  };

  const handleAddUser = async () => {
    const { name, username, email, password } = newUser;

    if (!name || !username || !email || !password) {
      setError("All fields are required");
      return;
    }

    const isDuplicate = users.some((user) => user.username === username || user.email === email);
    if (isDuplicate) {
      setError("Username or Email already exists");
      return;
    }

    const newDeveloper = {
      id: `u${users.length + 1}`,
      name,
      username,
      role: "developer",
      email,
      password
    };

    try {
      await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDeveloper),
      });
      fetchUsers();
      setNewUser({ name: "", username: "", email: "", password: "" });
      setShowAddDeveloper(false);
      showNotification("Developer added successfully!");
    } catch {
      setError("Failed to add developer");
    }
  };

  const handleEditUser = async () => {
    if (!editUser) return;

    try {
      await fetch(`http://localhost:5000/users/${editUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editUser),
      });
      fetchUsers();
      setEditUser(null);
      setShowEditModal(false);
      showNotification("Developer updated successfully!");
    } catch {
      setError("Failed to update developer");
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await fetch(`http://localhost:5000/users/${id}`, { method: "DELETE" });
      fetchUsers();
      showNotification("Developer deleted successfully!");
    } catch {
      setError("Failed to delete developer");
    }
  };

  const handleUpdatePassword = async () => {
    const { username, newPassword } = passwordUpdate;

    if (!username || !newPassword) {
      setError("Both username and new password are required");
      return;
    }

    const user = users.find((user) => user.username === username);
    if (!user) {
      setError("Username not found");
      return;
    }

    try {
      await fetch(`http://localhost:5000/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });
      fetchUsers();
      setPasswordUpdate({ username: "", newPassword: "" });
      setShowUpdatePassword(false);
      showNotification("Password updated successfully!");
    } catch {
      setError("Failed to update password");
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedUser(null);
  };

  const handleEditModal = (user) => {
    setEditUser(user);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditUser(null);
  };

  const developerUsers = users.filter(user => user.role === "developer");

  return (
    <div className="container mx-auto my-10 p-6 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Developer Management</h1>

      {notification && (
        <div className="fixed top-5 right-5 bg-green-500 text-white p-3 rounded shadow-lg z-50">
          {notification}
        </div>
      )}

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => setShowAddDeveloper(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add New Developer
        </button>
        <button
          onClick={() => setShowUpdatePassword(true)}
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Update Password
        </button>
      </div>

      {showAddDeveloper && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">Add New Developer</h2>
            <input
              className="w-full p-2 mb-3 border rounded"
              placeholder="Name"
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <input
              className="w-full p-2 mb-3 border rounded"
              placeholder="Username"
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            />
            <input
              className="w-full p-2 mb-3 border rounded"
              placeholder="Email"
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <input
              type="password"
              className="w-full p-2 mb-3 border rounded"
              placeholder="Password"
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowAddDeveloper(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {showUpdatePassword && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">Update Password</h2>
            <input
              className="w-full p-2 mb-3 border rounded"
              placeholder="Username"
              onChange={(e) => setPasswordUpdate({ ...passwordUpdate, username: e.target.value })}
            />
            <input
              type="password"
              className="w-full p-2 mb-3 border rounded"
              placeholder="New Password"
              onChange={(e) => setPasswordUpdate({ ...passwordUpdate, newPassword: e.target.value })}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowUpdatePassword(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdatePassword}
                className="px-4 py-2 bg-yellow-600 text-white rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Username</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {developerUsers.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="py-2 px-4">{user.name}</td>
                <td className="py-2 px-4">{user.username}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleViewDetails(user)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mr-2"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEditModal(user)}
                    className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDetailsModal && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">User Details</h2>
            <p><strong>Name:</strong> {selectedUser.name}</p>
            <p><strong>Username:</strong> {selectedUser.username}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <div className="flex justify-end">
              <button
                onClick={closeDetailsModal}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">Edit Developer</h2>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              className="w-full p-2 mb-3 border rounded"
              value={editUser.name}
              onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
            />
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              className="w-full p-2 mb-3 border rounded"
              value={editUser.username}
              onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
            />
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              className="w-full p-2 mb-3 border rounded"
              value={editUser.email}
              onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleEditUser}
                className="px-4 py-2 bg-yellow-600 text-white rounded"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
