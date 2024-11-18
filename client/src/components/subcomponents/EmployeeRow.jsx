import React, { useState } from "react";
import { toast } from "react-toastify";
import { post } from "../../api/api";
import { useNavigate } from "react-router-dom";

const tableColumn =
  "max-w-18 px-2 border-gray-200 border-2 text-end whitespace-nowrap overflow-x-hidden";

const EmployeeRow = ({ props }) => {
  const deleteEmployee = async (event) => {
    try {
      setLoading(true);
      const options = {
        credentials: "include",
        body: JSON.stringify({ _id: employee._id }),
      };
      const result = await post("/employee/delete", options);
      if (!result.success) {
        toast.error(result.message);
      } else {
        deleteEmployeeData(employee._id);
        toast.success("Employee Deletion sucessful!");
      }
    } catch (error) {
      toast.error("Something went Wrong!");
    } finally {
      setLoading(false);
    }
  };
  const { employee, deleteEmployeeData } = props;
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  return (
    <tr
      className={`bg-slate-100 font-medium text-sm hover:bg-slate-200 ${
        isLoading && "opacity-60"
      }`}
    >
      <td className={tableColumn} title={employee._id}>
        {employee._id}
      </td>
      <td className={tableColumn}>
        <img
          className="w-12 rounded-full"
          src={employee.image?.url}
          alt="employee"
        />
      </td>
      <td className={tableColumn} title={employee.name}>
        {employee.name}
      </td>
      <td className={tableColumn} title={employee.email}>
        {employee.email}
      </td>
      <td className={tableColumn} title={employee.mobile}>
        {employee.mobile}
      </td>
      <td className={tableColumn} title={employee.designation}>
        {employee.designation}
      </td>
      <td className={tableColumn} title={employee.gender}>
        {employee.gender}
      </td>
      <td className={tableColumn} title={employee.course}>
        {employee.course}
      </td>
      <td
        className={tableColumn}
        title={new Date(employee.createdAt).toLocaleDateString()}
      >
        {new Date(employee.createdAt).toLocaleDateString()}
      </td>
      <td className={`${tableColumn} text-base`}>
        <button
          className="mx-2 px-2 bg-blue-500 text-white"
          title="Edit"
          onClick={() => navigate("/updateEmployee", { state: { employee } })}
        >
          Edit
        </button>
        <button
          className="px-2 bg-blue-500 text-white"
          title="Delete"
          onClick={deleteEmployee}
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default EmployeeRow;
