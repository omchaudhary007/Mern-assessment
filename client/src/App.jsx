import React, {
  useState,
  createContext,
  useContext,
  useEffect,
  Suspense,
} from "react";
import { Routes, Route, Navigate } from "react-router-dom";
const Home = React.lazy(() => import("./components/Home"));
const Login = React.lazy(() => import("./components/Login"));
const Employees = React.lazy(() => import("./components/Employees"));
import Loading from "./components/subcomponents/Loading";
import { get } from "./api/api";
import EmployeeForm from "./components/subcomponents/EmployeeForm";

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

const App = () => {
  const [username, setUsername] = useState("");
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await get("/admin/getAdmin", { credentials: "include" });
        setUsername(result.userName);
      } catch (error) {
        console.error("Something went wrong!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <Loading height="h-[60vh]" width="w-screen" />;
  }

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route
            path="/"
            element={username ? <Home /> : <Navigate to="/login" />}
          >
            <Route
              path="/"
              element={
                <p className="w-full my-[20vh] text-center font-bold text-3xl">
                  Welcome <span>{username}</span>
                </p>
              }
            />
            <Route path="employees" element={<Employees />} />
            <Route
              path="createEmployee"
              element={<EmployeeForm title="Create Employee" option="create" />}
            />
            <Route
              path="updateEmployee"
              element={<EmployeeForm title="Update Employee" option="update" />}
            />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </UserContext.Provider>
  );
};

export default App;
