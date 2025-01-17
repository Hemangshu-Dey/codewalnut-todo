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

const Profile = () => {
  const [categoryNames, setCategoryNames] = useState<Array<CategoryName>>([]);

  const {
    currentUser,
    setCurrentUser,
    activeCategory,
    setActiveCategory,
    categoryReRender,
    todoReRender,
    popoverState,
    setPopoverState,
    todosState,
    setTodosState,
  } = useStore();

  const navigate = useNavigate();

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
        setTodosState(response.data.data || []);
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
  }, [todoReRender, activeCategory, setTodosState, navigate, setCurrentUser]);

  return (
    <div className="flex flex-col h-screen">
      <Navbar className="w-full z-10" />
      <div className="flex flex-1 overflow-y-auto">
        <Sidebar className="flex-shrink-0 w-64" categoryNames={categoryNames} />
        <div className="flex flex-col items-center justify-center mt-5 w-full">
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
          <main className="flex-1 flex flex-col items-center justify-center overflow-y-auto mb-5">
            <div className="max-w-3xl w-full p-4 space-y-4 max-h-[calc(100vh-12rem)] mb-5">
              {todosState?.map((todo) => (
                <ToDo key={todo._id} todos={todo} />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;
