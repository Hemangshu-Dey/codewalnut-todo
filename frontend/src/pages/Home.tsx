import { useEffect, useCallback } from "react";
import axios from "axios";
import { useUserStore } from "@/utils/store";
import { getNewAccessToken } from "@/utils/getNewAccessToken";
import { useNavigate, Outlet } from "react-router-dom";

const Home = () => {
  const { currentUser, setCurrentUser } = useUserStore();
  const navigate = useNavigate();


  const validation = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/validation`,
        {
          withCredentials: true,
        }
      );
      console.log("Validation response:", response.data);
      setCurrentUser({
        userid: response.data.data.id,
        username: response.data.data.username,
        email: response.data.data.email,
      });

      navigate("/profile");
    } catch (error) {
      console.log("Error reached");

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
            navigate("/profile");
          }
        } else {
          navigate("/register");
        }
      } else {
        navigate("/register");
      }
    }
  }, [navigate, setCurrentUser]);
  useEffect(() => {
    if (!currentUser?.username) validation();
  }, [currentUser, validation]);

  return <Outlet />;
};

export default Home;
