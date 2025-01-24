import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useNavigate } from "react-router-dom";
import { passwordRegEx, emailRegEx } from "@/constants/regEx";
import { toast } from "sonner";
import axios from "axios";

interface FormData {
  username: string;
  email: string;
  password: string;
}

export default function Register() {
  const navigate = useNavigate();
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const goToLogin = () => {
    navigate("/login");
  };

  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
  });

  const clearFormData = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name: string = e.target.name;
    const value: string = e.target.value;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDisabled(true);

    for (const key in formData) {
      if (!formData[key as keyof FormData]) {
        setIsDisabled(false);
        toast.error("Ensure no fields are empty.");
        return;
      }
    }

    if (!emailRegEx.test(formData.email)) {
      setIsDisabled(false);
      toast.error("Enter a valid email.");
      return;
    }

    if (!passwordRegEx.test(formData.password)) {
      setIsDisabled(false);
      toast.error(
        "Enter a strong password:\n- At least 8 characters long\n- Contains a lowercase letter\n- Contains an uppercase letter\n- Contains a number\n- Contains a special character",
      );
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        },
      );

      toast.success("User registered successfully.");
      navigate("/login");
    } catch (error: unknown) {
      console.error(error);
      toast.error("Error registering user.");
    }

    clearFormData();
    setIsDisabled(false);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Register
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleRegister}>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Enter username..."
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email..."
                value={formData.email}
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
            <Button type="submit" className="w-full" disabled={isDisabled}>
              Register
            </Button>

            <p className="w-full mt-4 text-center">
              Have an account?
              <a
                onClick={goToLogin}
                className="text-blue-600 hover:underline disabled:pointer-events-none disabled:opacity-50 pl-2"
                aria-disabled={isDisabled}
              >
                Login here
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
