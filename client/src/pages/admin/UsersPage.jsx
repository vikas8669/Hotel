import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import AdminDashboard from "../../components/navbars/AdminDashboard";
import { API_URL } from "../../Config";

const UsersPage = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    isAdmin: false,
  });
  const [editUser, setEditUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || !user.isAdmin) return;
    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/admin/users`, {
        withCredentials: true,
      });
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (err) {
      setError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(value) ||
        user.email.toLowerCase().includes(value) ||
        (user.isAdmin ? "admin" : "user").includes(value)
    );
    setFilteredUsers(filtered);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/admin/users`, newUser, {
        withCredentials: true,
      });
      fetchUsers();
      setNewUser({ name: "", email: "", password: "", isAdmin: false });
    } catch (err) {
      setError("Failed to create user.");
    }
  };

  const handleEditUser = (userToEdit) => {
    setEditUser({ ...userToEdit });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const userToUpdate = { ...editUser };
    if (!userToUpdate.password) delete userToUpdate.password;

    try {
      await axios.put(
        `${API_URL}/api/admin/users/${editUser._id}`,
        userToUpdate,
        { withCredentials: true }
      );
      fetchUsers();
      setEditUser(null);
    } catch (err) {
      setError("Failed to update user.");
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/admin/users/${id}`, {
        withCredentials: true,
      });
      fetchUsers();
    } catch (err) {
      setError("Failed to delete user.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (editUser) {
      setEditUser({
        ...editUser,
        [name]: type === "checkbox" ? checked : value,
      });
    } else {
      setNewUser({
        ...newUser,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container max-w-6xl mx-auto px-4">
        <AdminDashboard />
        <h1 className="text-3xl font-bold text-center mb-6">Manage Users</h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by name, email, or role (Admin/User)"
            className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Create / Edit User Form */}
        <form
          onSubmit={editUser ? handleUpdateUser : handleCreateUser}
          className="mb-8 p-4 border rounded-lg bg-white shadow-md"
        >
          <h2 className="text-xl font-semibold mb-4">
            {editUser ? "Edit User" : "Create New User"}
          </h2>
          <input
            type="text"
            name="name"
            value={editUser ? editUser.name : newUser.name}
            onChange={handleInputChange}
            placeholder="Name"
            className="border p-2 w-full mb-4 rounded"
          />
          <input
            type="email"
            name="email"
            value={editUser ? editUser.email : newUser.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="border p-2 w-full mb-4 rounded"
          />
          <input
            type="password"
            name="password"
            value={editUser ? editUser.password || "" : newUser.password}
            onChange={handleInputChange}
            placeholder="Password"
            className="border p-2 w-full mb-4 rounded"
          />
          <label className="flex items-center mb-4">
            <input
              type="checkbox"
              name="isAdmin"
              checked={editUser ? editUser.isAdmin : newUser.isAdmin}
              onChange={handleInputChange}
              className="mr-2"
            />
            Is Admin
          </label>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            {editUser ? "Update User" : "Create User"}
          </button>
        </form>

        {/* Users List */}
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="w-full table-auto text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="border-t">
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.isAdmin ? "Admin" : "User"}</td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="bg-green-600 hover:bg-green-800 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
