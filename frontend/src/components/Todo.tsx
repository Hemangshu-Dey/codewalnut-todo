import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import CheckBox from "./ui/Checkbox";
import { Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import useStore from "@/utils/store";

interface todoProps {
  todos: {
    createdAt: Date;
    deadline: Date;
    description: string;
    isComplete: boolean;
    title: string;
    todoCategoryId: string;
    updatedAt: Date;
    __v: number;
    _id: string;
  };
}

const ToDo: React.FC<todoProps> = ({ todos }) => {
  const [date, setDate] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const todoRender = useStore((state) => state.todoReRender);
  const setTodoRender = useStore((state) => state.setTodoReRender);

  const setCurrentUserState = useStore((state) => state.setCurrentUser);
  const [deadlineColor, setDeadlineColor] = useState<string>("");

  useEffect(() => {
    const dateObj = new Date(todos.deadline);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    dateObj.setHours(0, 0, 0, 0);

    setDate(
      dateObj.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    );

    if (dateObj < today) {
      setDeadlineColor("text-red-500");
    } else if (dateObj.getTime() === today.getTime()) {
      setDeadlineColor("text-amber-500");
    } else {
      setDeadlineColor("text-green-500");
    }
  }, [todos.deadline]);

  const handleTodoDelete = async () => {
    setIsDisabled(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/todo/deleteToDo?id=${
          todos._id
        }`,
        {
          withCredentials: true,
        },
      );
      toast.success(`${todos.title} task deleted.`);
      setTodoRender(!todoRender);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.error("Failed to delete category. Try again.");
          setCurrentUserState({
            userid: "",
            username: "",
            email: "",
          });
        } else {
          toast.error(`${error.response?.data.message}.`);
        }
      } else {
        toast.error("An unknown error occurred.");
      }
    }
    setIsDisabled(false);
  };

  useEffect(() => {
    const dateObj = new Date(todos.deadline);
    setDate(
      dateObj.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    );
  }, [todos.deadline]);

  return (
    <div className="flex justify-center items-center max-h-[calc(100vh-5rem)] px-4">
      <Card className="w-full sm:w-[450px] lg:w-[500px] h-auto shadow-lg p-6">
        <CardContent>
          <div>
            <div
              className="flex items-center gap-3 justify-end"
              title="Mark as completed"
            >
              <CheckBox id={todos?._id} isComplete={todos?.isComplete} />
              <button
                onClick={handleTodoDelete}
                disabled={isDisabled}
                className="hover:text-red-400"
                title="Delete this task"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <div className="grid w-full items-center gap-6">
              {/* Title and Delete Section */}
              <div className="flex justify-between items-center mt-2">
                <div
                  className={`font-extrabold leading-none tracking-tight text-xl ${
                    todos.isComplete ? "line-through text-gray-500" : ""
                  }`}
                >
                  <p className="pb-2">Task Name:</p> {todos.title}
                </div>
              </div>

              {/* Description Section */}
              <div className="flex flex-col space-y-1.5">
                <p
                  className={`${
                    todos.isComplete ? "line-through text-gray-500" : ""
                  }`}
                >
                  Task Description:
                </p>
                <Label
                  htmlFor="description"
                  className={`${
                    todos.isComplete ? "line-through text-gray-500" : ""
                  }`}
                >
                  {todos.description}
                </Label>
              </div>

              {/* Deadline Section */}
              <div className="flex flex-col space-y-1.5">
                <Label
                  htmlFor="deadline"
                  className={`flex flex-row gap-2 ${
                    todos.isComplete
                      ? "line-through text-gray-500"
                      : deadlineColor
                  }`}
                >
                  <p>Deadline:</p>
                  {date}
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ToDo;
