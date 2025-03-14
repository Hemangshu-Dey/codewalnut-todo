import React, { useState } from "react";
import { Clipboard, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/atoms/Input/Input";
import axios from "axios";
import { toast } from "sonner";
import useStore from "@/utils/store";

interface categoryName {
  categoryName: string;
  _id: string;
  createdAt: Date;
  todos: Array<string>;
  updatedAt: Date;
  __v: number;
}

interface SidebarProps {
  className?: string;
  categoryNames: Array<categoryName>;
}

const Sidebar: React.FC<SidebarProps> = ({ className = "", categoryNames }) => {
  const [categoryValue, setCategoryValue] = useState<string>("");
  const categoryRender = useStore((state) => state.categoryReRender);
  const setCategoryRender = useStore((state) => state.setCategoryReRender);

  const activeCategoryId = useStore((state) => state.activeCategory);
  const setActiveCategoryId = useStore((state) => state.setActiveCategory);

  const setCurrentUserState = useStore((state) => state.setCurrentUser);

  const todoRender = useStore((state) => state.todoReRender);
  const setTodoRender = useStore((state) => state.setTodoReRender);

  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const changeActiveCategory = (item: categoryName) => {
    if (item._id) setActiveCategoryId(item._id);
  };

  const handleCategoryValueChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setCategoryValue(e.target.value);
  };

  const handleCategoryDelete = async (
    e: React.MouseEvent,
    item: categoryName,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDisabled(true);

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/todo/deleteToDoCategory?id=${
          item._id
        }`,
        {
          withCredentials: true,
        },
      );
      toast.success(`${item.categoryName} category deleted.`);
      setCategoryRender(!categoryRender);
      setTodoRender(!todoRender);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error);
        if (error.response?.status == 401) {
          toast.error(`Failed to delete category. Try again.`);
          setCurrentUserState({
            userid: "",
            username: "",
            email: "",
          });
        } else {
          toast.error(`${error.response?.data.message}.`);
        }
      } else {
        toast.error(`An unknown error occurred.`);
      }
    }

    setIsDisabled(false);
  };

  const handleAddCategory = async () => {
    setIsDisabled(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/todo/createToDoCategory`,
        {
          categoryName: categoryValue,
        },
        {
          withCredentials: true,
        },
      );
      toast.success(`${categoryValue} category added.`);
      setCategoryRender(!categoryRender);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status == 401) {
          toast.error(`Unable to add category. Try again.`);
          setCurrentUserState({
            userid: "",
            username: "",
            email: "",
          });
        } else {
          toast.error(`${error.response?.data.message}.`);
        }
      } else {
        toast.error(`An unknown error occurred.`);
      }
    }
    setCategoryValue("");
    setIsDisabled(false);
  };

  return (
    <div
      className={`w-64 max-h-[calc(100vh-5rem)] bg-gray-100 border-r overflow-hidden border-gray-200 flex flex-col h-full shadow-slate-400 shadow-xl ${className}`}
    >
      <div className="flex-1 overflow-hidden flex flex-col">
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-2 p-4">
            {categoryNames.map((item) => (
              <li key={item?._id}>
                <button
                  onClick={() => {
                    changeActiveCategory(item);
                  }}
                  className={`w-full flex items-center space-x-3 p-2 rounded-md transition-colors ${
                    activeCategoryId === item._id
                      ? "bg-gray-300 text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {" "}
                  <div className="flex flex-row justify-between items-center w-full">
                    <div className="flex items-center space-x-2">
                      <Clipboard className="w-5 h-5" />
                      <span>{item?.categoryName}</span>
                    </div>
                    <button
                      onClick={(e) => handleCategoryDelete(e, item)}
                      disabled={isDisabled}
                      className="hover:scale-110"
                    >
                      <Trash2 className="w-5 h-5 hover:text-red-400" />
                    </button>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <Input
            onChange={handleCategoryValueChange}
            id="categoryValue"
            type="text"
            value={categoryValue}
            placeholder="Enter a category"
          />
          <div className="flex justify-center mt-4">
            <button
              className="group gap-1 inline-flex w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:scale-105  ease-in-out duration-300 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
              onClick={handleAddCategory}
              disabled={isDisabled}
            >
              <Plus className="w-5" />
              <p>Add Category</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
