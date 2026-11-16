import { useEffect, useState } from "react";
import { IoIosAdd } from "react-icons/io";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import TodoList from "../components/TodoList";
import { formattedDate } from "../lib/utils";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useNavigate } from "react-router";

type TodoItem = {
  id?: string;
  text: string;
  completed: boolean;
}

const HomePage = () => {
  const [isClicked, setIsClicked] = useState('one')
  const [isAddTodoText, setIsAddTodoText] = useState("")
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [userName, setUserName] = useState("User")
  const [loading, setLoading] = useState(true);

  // Edit models
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editText, setEditText] = useState("")

  const navigate = useNavigate()

  const today = new Date()
  const formatDate = formattedDate(today)

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [profileRes, todosRes] = await Promise.all([
          api.get('/auth/profile'),
          api.get('/todo')
        ]);

        setUserName(profileRes.data.name);
        setTodos(todosRes.data);
      } catch (err: unknown) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem('token');
        navigate('/', { replace: true });
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [navigate]);
  const isList = todos.length > 0

  const activeTodo = (): number => {
    return todos.filter(task => task && !task.completed).length;
  }

  const handleAddTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!isAddTodoText.trim()) return;

    try {
      const response = await api.post('/todo', { text: isAddTodoText })

      // Depending on whether your backend returns response.data directly or wrapped in data:
      const newTodo = response.data.data || response.data;

      setTodos([newTodo, ...todos]);
      setIsAddTodoText("");
      toast.success("Todo added successfully!");

    } catch (err: unknown) {
      const errorMsg = (err as any).response?.data?.message || "Failed to add todo";
      toast.error(Array.isArray(errorMsg) ? errorMsg.join('. ') : errorMsg);
    }
  }

  const handleToggleTask = async (index: number) => {
    const taskToUpdate = todos[index];
    if (!taskToUpdate?.id) return;

    const previousCompletedStatus = taskToUpdate.completed;
    const newStatus = !previousCompletedStatus;

    // 1. OPTIMISTIC UPDATE: Update the UI state instantly (< 1ms response)
    const updatedList = [...todos];
    updatedList[index] = { ...taskToUpdate, completed: newStatus };
    setTodos(updatedList);

    try {
      // 2. Send the request to the backend in the background
      await api.patch(`/todo/${taskToUpdate.id}`, {
        completed: newStatus
      });
    } catch (err: unknown) {
      // 3. ROLLBACK: If the network request fails, revert the checkbox back and notify the user
      const revertedList = [...todos];
      revertedList[index] = { ...taskToUpdate, completed: previousCompletedStatus };
      setTodos(revertedList);

      toast.error("Failed to update task status");
    }
  }

  const handleDeleteTask = async (index: number) => {
    const taskToDelete = todos[index];
    if (!taskToDelete?.id) return;

    try {
      await api.delete(`/todo/${taskToDelete.id}`);

      const updatedList = todos.filter((_, i) => i !== index);
      setTodos(updatedList);
      toast.success("Task deleted successfully!");
    } catch (err: unknown) {
      toast.error("Failed to delete task");
    }
  }

  const handleOpenEdit = (index: number) => {
    setEditingIndex(index)
    setEditText(todos[index].text)
  }

  const handleEditTask = async () => {
    if (editingIndex !== null && editText.trim() !== '') {
      const taskToEdit = todos[editingIndex];
      if (!taskToEdit?.id) return;

      try {
        const response = await api.patch(`/todo/${taskToEdit.id}`, {
          text: editText
        });

        const updatedList = [...todos];
        updatedList[editingIndex] = response.data.data || response.data;
        setTodos(updatedList);

        setEditingIndex(null);
        setEditText('');
        toast.success("Task updated successfully!");
      } catch (err: unknown) {
        toast.error("Failed to update task");
      }
    }
  }

  const filteredTask = todos.filter(task => {
    if (!task) return false;
    if (isClicked == "two") return !task.completed
    if (isClicked == "three") return task.completed
    return true;
  })

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear the JWT token
    toast.success("Logged out successfully");
    navigate("/", { replace: true }); // Redirect to login page
  };

  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-violet-100 flex items-center justify-center">
  //       <div className="flex flex-col items-center gap-3">
  //         <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
  //         <p className="text-indigo-900 font-medium text-sm">Loading your workspace...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="outer-card bg-violet-100">
      <div className="inner-card">
        {/* Topper Header */}
        <div className="w-full h-35 bg-indigo-600">
          <div className=" flex justify-around items-center h-full">
            <div className="space-y-1">
              <h1>My Tasks</h1>
              <p>Stay organized and get things done</p>
            </div>
            <div className="name-date-block">
              <p className="date-block">{formatDate}</p>
              <p>Mr. {userName}</p>
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="bg-indigo-700 hover:bg-indigo-800 text-white text-xs px-3 py-1.5 rounded-md font-medium cursor-pointer transition"
              >
                Logout
              </button>
            </div>

          </div>
        </div>

        {/* 2nd layer Add Task */}
        <form onSubmit={handleAddTodo} className="w-full h-[91px] bg-slate-100 flex justify-center gap-4 items-center">
          <input
            type="text"
            className="todo-input"
            placeholder="Add a new task..."
            value={isAddTodoText}
            onChange={(e) => setIsAddTodoText(e.target.value)}
          />
          <button className="add-btn flex items-center justify-center pe-1 cursor-pointer" type="submit">
            <IoIosAdd className="w-7 h-7" />Add
          </button>
        </form>

        {/* 3rd layer filter btns */}
        <div className="w-full h-[71px] bg-violet-50 flex justify-between items-center px-4 shadow-sm">
          <div className="filter-btn-container">
            <button onClick={() => setIsClicked('one')} className={`${isClicked == 'one' ? 'clicked' : 'not-clicked'}`}>All</button>
            <button onClick={() => setIsClicked('two')} className={`${isClicked == 'two' ? 'clicked' : 'not-clicked'}`}>Active</button>
            <button onClick={() => setIsClicked('three')} className={`${isClicked == 'three' ? 'clicked' : 'not-clicked'}`}>Completed</button>
          </div>
          <div>
            <p className="text-slate-400">{activeTodo()} {activeTodo() > 1 ? "tasks left" : "task left"}</p>
          </div>
        </div>

        <div className="w-full h-[286px] bg-inherit scroll-smooth overflow-scroll no-scrollbar">

          {loading ? (
            // Loading spinner inside the card body
            <div className="flex flex-col items-center justify-center gap-2 h-full">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-400 text-sm">Loading tasks...</p>
            </div>
          ) : <div className="flex flex-col items-center justify-center mx-3 my-1">{
            isList ? (
              <TodoList
                tasks={filteredTask}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
                onEditTask={handleOpenEdit}
              />
            ) : (
              <>
                <HiOutlineClipboardDocumentList className="w-30 h-30 opacity-25 mt-18" />
                <p className="text-md text-gray-400 mt-3">No tasks yet. Add one above!</p>
              </>
            )}</div>}

        </div>

        <div className="w-full h-[58px] bg-slate-100 flex items-center justify-end">
          <p className="text-slate-400 text-sm pe-6">Stored in Cloud Storage</p>
        </div>
      </div>

      {/* Edit popup window */}
      {editingIndex !== null && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-[400px] flex flex-col gap-4">
            <h2 className="text-lg font-bold text-gray-800">Edit Task</h2>

            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleEditTask()}
              autoFocus
            />

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 cursor-pointer text-sm font-medium"
                onClick={() => setEditingIndex(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 cursor-pointer text-sm font-medium"
                onClick={handleEditTask}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;