import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loading from "./subcomponents/Loading";
import { get } from "../api/api";
import EmployeeRow from "./subcomponents/EmployeeRow";
import { useNavigate } from "react-router-dom";

const tableColum = "p-2 border-gray-200 border-2 text-right";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [limit, setLimit] = useState(25);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState([]);
  const [isSortHide, setSorthide] = useState(true);
  const navigate = useNavigate();

  const deleteEmployeeData = (id) => {
    setEmployees((prevEmployees) =>
      prevEmployees.filter((emp) => emp._id !== id)
    );
  };

  const handleSortChange = (e) => {
    const { value, checked } = e.target;
    setSort((prevSort) =>
      checked ? [...prevSort, value] : prevSort.filter((item) => item !== value)
    );
  };
  useEffect(() => {
    const useFetch = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams({
          limit: limit,
          search: search,
          page: page,
          sort: sort.join(","),
        }).toString();
        const result = await get(`/employee/all-employee?${queryParams}`, {
          credentials: "include",
        });
        
        if (!result.success) {
          toast.error(result.message);
        } else {
          setEmployees(result.employees);
        }
      } catch (error) {
        toast.error("Something went wrong!");
      } finally {
        setLoading(false);
      }
    };
    useFetch();
  }, [limit, search, page, sort]);
  if (isLoading) return <Loading height={"h-[50vh]"} width={"w-full"} />;

  return (
    <div className="w-full overflow-hidden">
      <h3 className="w-fit m-2 text-cyan-700 text-xl font-semibold">
        Employee List
      </h3>

      {!employees.length ? (
        <h3 className="my-10 text-lg font-medium text-center">
          Employee not found.
        </h3>
      ) : (
        <>
          <div className="w-screen px-2 mb-2 flex items-center justify-end gap-4">
            <p className="text-sm font-semibold">
              Total Count: {employees.length}
            </p>
            <button
              className="px-3 py-1 bg-red-600 text-white font-medium active:bg-red-700"
              onClick={() => navigate("/createEmployee")}
            >
              Create Employee
            </button>
          </div>
          <div className="w-screen px-4 py-2 flex items-center justify-end">
            <p className="mx-2 font-semibold text-cyan-600">Search</p>
            <input
              className="bg-transparent outline-none border-b-2 border-b-black"
              type="search"
              placeholder="Enter search keyword"
              onChange={() => setSearch(e.target.value)}
            />
          </div>
          <div className="w-screen overflow-x-auto scroll-hide">
            <table className="w-full">
              <thead>
                <tr className="bg-green-400 text-red-500">
                  <th className={tableColum}>Unique Id</th>
                  <th className={tableColum}>Image</th>
                  <th className={tableColum}>Name</th>
                  <th className={tableColum}>Email</th>
                  <th className={tableColum}>Mobile No.</th>
                  <th className={tableColum}>Designation</th>
                  <th className={tableColum}>Gender</th>
                  <th className={tableColum}>Course</th>
                  <th className={tableColum}>Create Date</th>
                  <th className={tableColum}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee, index) => (
                  <EmployeeRow
                    props={{ employee, deleteEmployeeData }}
                    key={index}
                  />
                ))}
              </tbody>
            </table>
            <div className="w-full px-10 py-3 fixed bottom-0 bg-gray-600 flex items-center justify-end gap-4 text-sm font-medium text-white">
              <div className="flex items-center gap-2">
                <p className="mx-2">Row per Page:</p>
                <select
                  className="rounded-sm text-black"
                  name="limit"
                  onChange={(e) => setLimit(e.target.value)}
                >
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="200">200</option>
                </select>
              </div>
              <p>
                Page: <span>{page}</span>
              </p>
              <div className="text-xl flex items-center gap-2">
                <button
                  className="px-2 py-1 active:bg-slate-400"
                  onClick={() => {
                    if (page - 1 > 0) setPage(page - 1);
                  }}
                >
                  &lt;
                </button>
                <button
                  className="px-2 py-1 active:bg-slate-400"
                  onClick={() => setPage(page + 1)}
                >
                  &gt;
                </button>
              </div>
              <button
                className="px-2 py-1 bg-red-600 rounded-sm active:bg-red-700"
                onClick={() => setSorthide(!isSortHide)}
              >
                {isSortHide ? "Show" : "Hide"}
              </button>
              <div
                className={`${
                  isSortHide && "hidden"
                } absolute bottom-20 p-6 bg-orange-800`}
              >
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    name="sort"
                    value="name"
                    onChange={handleSortChange}
                  />
                  <span>Name</span>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    name="sort"
                    value="email"
                    onChange={handleSortChange}
                  />
                  <span>Email</span>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    name="sort"
                    value="createdAt"
                    onChange={handleSortChange}
                  />
                  <span>Create Date</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Employees;
