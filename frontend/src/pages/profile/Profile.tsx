import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { getNewAccessToken } from "@/utils/getNewAccessToken";
import ToDo from "@/components/Todo";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import AddTask from "@/components/AddTask";
import useStore from "@/utils/store";

interface CategoryName {
  categoryName: string;
  _id: string;
  createdAt: Date;
  todos: Array<string>;
  updatedAt: Date;
  __v: number;
}

interface Todo {
  createdAt: Date;
  deadline: Date;
  description: string;
  isComplete: boolean;
  title: string;
  todoCategoryId: string;
  updatedAt: Date;
  __v: number;
  _id: string;
}

const Profile = () => {
  const [categoryNames, setCategoryNames] = useState<Array<CategoryName>>([]);
  const [todos, setTodos] = useState<Array<Todo>>([]);

  const {
    currentUser,
    setCurrentUser,
    activeCategory,
    setActiveCategory,
    categoryReRender,
    todoReRender,
    popoverState,
    setPopoverState,
  } = useStore();

  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
  };

  useEffect(() => {
    if (currentUser.username) return;

    const validation = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/validation`,
          {
            withCredentials: true,
          }
        );

        setCurrentUser({
          userid: response.data.data.id,
          username: response.data.data.username,
          email: response.data.data.email,
        });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status == 401) {
            const res = await getNewAccessToken();
            if (res === "401") navigate("/register");
            else {
              setCurrentUser({
                userid: res.data.data.id,
                username: res.data.data.username,
                email: res.data.data.email,
              });
            }
          } else {
            toast.error("Error fetching data");
          }
        } else {
          toast.error("An unknown error occurred");
        }
      }
    };
    validation();
  }, [currentUser, navigate, setCurrentUser]);

  useEffect(() => {
    const getToDoCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/todo/getToDoCategory`,
          {
            withCredentials: true,
          }
        );
        setCategoryNames(response.data.data);
        setActiveCategory(response.data.data[0]?._id);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status == 401) {
            const res = await getNewAccessToken();
            if (res === "401") navigate("/register");
            else {
              setCurrentUser({
                userid: res.data.data.id,
                username: res.data.data.username,
                email: res.data.data.email,
              });
            }
          } else {
            toast.error("Error fetching data");
          }
        } else {
          toast.error("An unknown error occurred");
        }
      }
    };
    getToDoCategories();
  }, [categoryReRender, navigate, setActiveCategory, setCurrentUser]);

  useEffect(() => {
    if (!activeCategory) return;

    const getToDos = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/todo/getToDo?categoryId=${activeCategory}`,
          {
            withCredentials: true,
          }
        );
        setTodos(response.data.data || []);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status == 401) {
            const res = await getNewAccessToken();
            if (res === "401") navigate("/register");
            else {
              setCurrentUser({
                userid: res.data.data.id,
                username: res.data.data.username,
                email: res.data.data.email,
              });
            }
          } else {
            toast.error("Error fetching data");
          }
        } else {
          toast.error("An unknown error occurred");
        }
      }
    };
    getToDos();
  }, [todoReRender, activeCategory, navigate, setCurrentUser]);

  return (
    <div className="flex flex-col h-screen">
      <Navbar className="w-full z-10" />
      <div className="flex flex-1 overflow-y-auto">
        <Sidebar className="flex-shrink-0 w-64" categoryNames={categoryNames} />
        <div className="flex flex-col items-center justify-center mt-5 w-full">
          <div className="flex items-center justify-between w-full max-w-6xl px-4">
            {/* Add Task Button */}
            <Popover open={popoverState} onOpenChange={setPopoverState}>
              <PopoverTrigger>
                <button className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:scale-105 ease-in-out duration-300 disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 shadow-lg">
                  Add Task
                </button>
              </PopoverTrigger>
              <PopoverContent>
                <AddTask />
              </PopoverContent>
            </Popover>

            {/* Search Bar */}
            <div className="flex items-center w-full max-w-md">
              <input
                type="text"
                placeholder="Search tasks..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

          <main className="flex-1 flex flex-col items-center justify-center overflow-y-auto mb-5">
            <div className="max-w-6xl w-full p-4 space-y-4 max-h-[calc(100vh-12rem)] mb-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {todos
                  .filter((todo) =>
                    todo.title.toLowerCase().includes(searchQuery)
                  )
                  .map((todo) => (
                    <ToDo key={todo._id} todos={todo} />
                  ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;
