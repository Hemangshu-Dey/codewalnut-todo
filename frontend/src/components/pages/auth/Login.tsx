import { useState } from "react";
import { Button } from "@/components/atoms/Button/Button";
import { Input } from "@/components/atoms/Input/Input";
import { Label } from "@/components/atoms/Label/Label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/molecules/Card/Card";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import axios from "axios";
import useStore from "@/utils/store";
interface FormData {
  identifier: string;
  password: string;
}

export default function Login() {
  const [formData, setFormData] = useState<FormData>({
    identifier: "",
    password: "",
  });
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const goToRegister = () => {
    navigate("/register");
  };
  const setCurrentUserState = useStore((state) => state.setCurrentUser);
  const navigate = useNavigate();

  const clearFormData = () => {
    setFormData({
      identifier: "",
      password: "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDisabled(true);

    for (const key in formData) {
      if (!formData[key as keyof FormData]) {
        setIsDisabled(false);
        toast.error("Please fill in all fields");
        return;
      }
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        {
          identifier: formData.identifier,
          password: formData.password,
        },
        {
          withCredentials: true,
        },
      );
      setCurrentUserState({
        userid: response.data.data.id,
        username: response.data.data.username,
        email: response.data.data.email,
      });
      toast.success("Login successful!");
      navigate("/home");
    } catch (error: unknown) {
      console.error(error);
      toast.error("Invalid credentials");
    }
    clearFormData();
    setIsDisabled(false);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Toaster />
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="Username or password">Email or Username</Label>
              <Input
                id="identifier"
                name="identifier"
                type="test"
                placeholder="Enter email or username..."
                value={formData.identifier}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter password..."
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              onClick={handleLogin}
              disabled={isDisabled}
            >
              Login
            </Button>
            <p className="w-full mt-4 text-center">
              Don't have an account?
              <a
                onClick={goToRegister}
                className="text-blue-600 hover:underline disabled:pointer-events-none disabled:opacity-50 pl-2"
                aria-disabled={isDisabled}
              >
                Register here
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
