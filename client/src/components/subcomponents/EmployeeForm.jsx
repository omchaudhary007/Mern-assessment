import React, { useState } from "react";
import { toast } from "react-toastify";
import { post } from "../../api/api";
import { useLocation, useNavigate } from "react-router-dom";

const inputStyle = "w-full my-3 border-b-2 border-green-800 outline-none";
const labelText = "block font-medium whitespace-nowrap";

const EmployeeForm = ({ title, option }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { employee } = location.state || {};
  const [isLoading, setLoading] = useState(false);
  const [values, setValues] = useState({
    name: employee?.name || "",
    email: employee?.email || "",
    mobile: employee?.mobile || "",
    designation: employee?.designation || "",
    gender: employee?.gender || "",
    course: employee?.course || [],
    profileimage: null,
  });
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("mobile", values.mobile);
      formData.append("designation", values.designation);
      formData.append("gender", values.gender);
      formData.append("course", values.course);
      if(option=='update') formData.append('_id',employee._id);
      if (values.profileimage) {
        formData.append("profileimage", values.profileimage);
      }

      const url = option === "create" ? "/employee/create" : "/employee/update";
      const result = await post(url, {
        credentials: "include",
        body: formData,
      });

      if (result.success) {
        toast.success(`Employee ${option} successful.`);
        navigate("/");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setValues({ ...values, [name]: files[0] });
    } else if (type === "checkbox") {
      if (e.target.checked) {
        setValues({
          ...values,
          course: [...values.course, value],
        });
      } else {
        setValues({
          ...values,
          course: values.course.filter((item) => item !== value),
        });
      }
    } else {
      setValues({ ...values, [name]: value });
    }
  };

  return (
    <div
      className={`w-3/4 md:w-1/3 mx-auto my-3 p-4 bg-white rounded-md ${
        isLoading && "opacity-70"
      }`}
    >
      <h3 className="text-xl font-semibold mb-10 text-violet-950 whitespace-nowrap">
        {title}
      </h3>
      <form onSubmit={handleSubmit}>
        <label className={labelText} htmlFor="name">
          Name:
        </label>
        <input
          className={inputStyle}
          type="text"
          name="name"
          required
          value={values.name}
          onChange={handleChange}
        />

        <label className={labelText} htmlFor="email">
          Email:
        </label>
        <input
          className={inputStyle}
          type="email"
          name="email"
          required
          value={values.email}
          onChange={handleChange}
        />

        <label className={labelText} htmlFor="mobile">
          Mobile No:
        </label>
        <input
          className={inputStyle}
          type="text"
          name="mobile"
          required
          value={values.mobile}
          onChange={handleChange}
        />

        <label className={labelText} htmlFor="designation">
          Designation:
        </label>
        <select
          className="mb-3 w-full bg-gray-200 rounded-md"
          name="designation"
          required
          value={values.designation}
          onChange={handleChange}
        >
          <option value="HR">HR</option>
          <option value="manager">Manager</option>
          <option value="sales">Sales</option>
        </select>

        <label className="my-3 font-medium whitespace-nowrap" htmlFor="gender">
          Gender:
        </label>
        <input
          className="m-2"
          type="radio"
          name="gender"
          value="male"
          onChange={handleChange}
          checked={values.gender === "male"}
        />
        <span>Male</span>
        <input
          className="m-2"
          type="radio"
          name="gender"
          value="female"
          onChange={handleChange}
          checked={values.gender === "female"}
        />
        <span>Female</span>
        <input
          className="m-2"
          type="radio"
          name="gender"
          value="others"
          onChange={handleChange}
          checked={values.gender === "others"}
        />
        <span>Others</span>

        <label className="mb-3 font-medium whitespace-nowrap" htmlFor="course">
          Course:
        </label>
        <input
          className="m-2"
          type="checkbox"
          name="course"
          value="BCA"
          onChange={handleChange}
          checked={values.course.includes("BCA")}
        />
        <span>BCA</span>
        <input
          className="m-2"
          type="checkbox"
          name="course"
          value="MCA"
          onChange={handleChange}
          checked={values.course.includes("MCA")}
        />
        <span>MCA</span>
        <input
          className="m-2"
          type="checkbox"
          name="course"
          value="BSC"
          onChange={handleChange}
          checked={values.course.includes("BSC")}
        />
        <span>BSC</span>

        <label className={`${labelText} my-2`} htmlFor="profileimage">
          Profile Picture:
        </label>
        <input
          className="mb-2"
          type="file"
          name="profileimage"
          onChange={handleChange}
        />

        <button className="w-full px-2 py-1 mt-3 rounded-full text-lg text-white font-medium bg-orange-500 active:bg-orange-600">
          Submit
        </button>
      </form>
    </div>
  );
};

export default EmployeeForm;
