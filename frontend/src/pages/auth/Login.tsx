import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import axios from "axios";
import { useUserStore } from "@/utils/store";
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
  const { setCurrentUser } = useUserStore(); // Correct way to access the store

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
        toast.error("⚠︎ Please fill in all fields");
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
        }
      );

      setCurrentUser({
        userid: response.data.data.id,
        username: response.data.data.username,
        email: response.data.data.email,
      });
      toast.success("🎉 Login successful!");
      navigate("/profile");
    } catch (error: unknown) {
      console.error(error);
      toast.error("❗ Invalid credentials");
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
              <Label htmlFor="Username or password">Email</Label>
              <Input
                id="identifier"
                name="identifier"
                type="test"
                placeholder="Username or Email"
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
                placeholder="••••••••"
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
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
