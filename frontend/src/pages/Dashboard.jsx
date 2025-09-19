import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import backendURL from "../constant";
import { MdOutlineArrowBackIos } from "react-icons/md";
import { GoPlus } from "react-icons/go";
import { MdOutlineArrowForwardIos } from "react-icons/md";

export default function Dashboard() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [todoLabel, setTodoLabel] = useState("");
  const [todoStatus, setTodoStatus] = useState("Pending");
  const [editingTodo, setEditingTodo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const token = localStorage.getItem("token");

  // Fetch todos
  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendURL}/todo/get-all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message || "Failed to fetch todos");
      setTodos(result.todos || []);
    } catch (error) {
      console.error("Error fetching todos:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const openEditModal = (todo) => {
    setEditingTodo(todo);
    setTodoLabel(todo.name);
    setTodoStatus(todo.status);
    setShowModal(true);
  };

  const handleSubmitTodo = async (e) => {
    e.preventDefault();
    if (!todoLabel) return;

    try {
      const url = editingTodo
        ? `${backendURL}/todo/update/${editingTodo._id}`
        : `${backendURL}/todo/add`;
      const method = editingTodo ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: todoLabel, status: todoStatus }),
      });

      const result = await response.json();

      if (!result.success) throw new Error(result.message || "Failed to save todo");

      if (editingTodo) {
        setTodos((prev) =>
          prev.map((t) => (t._id === editingTodo._id ? result.todo : t))
        );
      } else {
        setTodos((prev) => [...prev, result.todo]);
      }

      setTodoLabel("");
      setTodoStatus("Pending");
      setEditingTodo(null);
      setShowModal(false);
    } catch (error) {
      console.error("Error saving todo:", error.message);
      alert(error.message);
    }
  };

  const handleDeleteTodo = async (id) => {
    if (!window.confirm("Are you sure you want to delete this todo?")) return;

    try {
      const response = await fetch(`${backendURL}/todo/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message || "Failed to delete todo");

      setTodos((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error.message);
      alert(error.message);
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(todos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTodos = todos.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="w-full h-screen py-8 lg:py-12">
      <div className="container mx-auto sm:px-0 px-4">
        {/* Heading and Add Button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Todo List</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-black hover:bg-opacity-75 text-white text-base p-1.5 lg:p-2.5 transition flex items-center justify-center gap-1"
          >
            <GoPlus fontSize={20} />
            Add New Todo
          </button>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="w-full container">
            <div className="w-full fixed lg:p-0 px-4 inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h2 className="form-heading text-left mb-5">
                  {editingTodo ? "Edit Todo" : "Add Todo"}
                </h2>
                <form onSubmit={handleSubmitTodo} className="flex flex-col gap-4 p-0 shadow-none">
                  <input
                    type="text"
                    placeholder="Todo Label"
                    className="form-input"
                    value={todoLabel}
                    onChange={(e) => setTodoLabel(e.target.value)}
                    required
                  />
                  <select
                    className="form-input"
                    value={todoStatus}
                    onChange={(e) => setTodoStatus(e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>

                  <div className="flex justify-end gap-2 ">
                    <button
                      type="button"
                      className="bg-none w-1/3 button text-black transition border"
                      onClick={() => {
                        setShowModal(false);
                        setEditingTodo(null);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-black w-1/3 button text-white transition"
                    >
                      {editingTodo ? "Update" : "Add"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Todo List Table */}
        <div className="mt-6 lg:pb-12 pb-8">
          {loading ? (
            <p className="text-gray-500">Loading todos...</p>
          ) : todos.length === 0 ? (
            <p className="text-gray-500">No todos added yet.</p>
          ) : (
            <>
              {/* Todo Rows */}
              <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center justify-center gap-5">
                {currentTodos.map((todo) => (
                  <div
                    key={todo._id}
                    className="w-full flex items-center justify-between p-2.5 bg-gray-100 hover:bg-gray-200"
                  >
                    {/* odd:bg-white even:bg-gray-100 */}
                    <div className="flex flex-col items-start gap-2.5">
                      <span className="w-full text-base font-medium">{todo.name}</span>
                      <span
                        className={`text-white font-medium w-full ${todo.status === "Pending"
                          ? "text-yellow-500"
                          : todo.status === "In Progress"
                            ? "text-blue-500"
                            : "text-green-500"
                          }`}
                      >
                        {todo.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-2.5">
                      <FaEdit
                        className="text-blue-600 cursor-pointer"
                        onClick={() => openEditModal(todo)}
                      />
                      <FaTrash
                        className="text-red-600 cursor-pointer"
                        onClick={() => handleDeleteTodo(todo._id)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {todos.length > itemsPerPage && (
                <div className="flex justify-center items-center gap-4 mt-8">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="p-3 bg-black hover:bg-opacity-75 disabled:hover:bg-opacity-100 disabled:opacity-50 rounded-none text-white"
                  >
                    <MdOutlineArrowBackIos />
                  </button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="p-3 bg-black hover:bg-opacity-75 disabled:hover:bg-opacity-100 disabled:opacity-50 rounded-none text-white"
                  >
                    <MdOutlineArrowForwardIos />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
