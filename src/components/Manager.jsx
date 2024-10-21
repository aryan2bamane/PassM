import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const Manager = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [form, setForm] = useState({ siteURL: "", userName: "", password: "" });
  const [passwordArray, setPasswordArray] = useState([]);
  const [error, setError] = useState("");
  const [isOpenArray, setIsOpenArray] = useState([]); // Array to track visibility for each password

  // useEffect to get the password array from local storage on reloading the page.
  useEffect(() => {
    const passwords = localStorage.getItem("passwords");
    if (passwords) {
      setPasswordArray(JSON.parse(passwords));
      setIsOpenArray(new Array(JSON.parse(passwords).length).fill(false)); // Initialize isOpenArray based on stored passwords
    }
  }, []);

  // Defining UI styles in a variable to update at once
  const glassUi =
    "bg-transparent border border-gray-500 rounded-lg backdrop-blur-lg";

  // Function to delete all the passwords
  const clearPasswords = () => {
    if (confirm("Are you sure that you want to delete ALL passwords?")) {
      setPasswordArray([]);
      localStorage.removeItem("passwords");
      setIsOpenArray([]);
    }
  };

  // Function to clear the contents of the form
  const clearForm = () => {
    setForm({ siteURL: "", userName: "", password: "" });
    setError(""); // Clear error message on form clear
  };

  // Function to handle form change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Function to submit the form and store the passwords
  const savePassword = (e) => {
    e.preventDefault();

    if (!form.siteURL || !form.userName || !form.password) {
      setError("All fields are required.");
      return;
    } else if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    // Update LocalStorage
    setPasswordArray((prev) => {
      const newArray = [...prev, form];
      localStorage.setItem("passwords", JSON.stringify(newArray));
      setIsOpenArray([...isOpenArray, false]); // Add a new false entry for the new password
      return newArray;
    });
    clearForm();
  };

  // Function to delete the password
  const deletePassword = (index) => {
    if (confirm("Are you sure that you want to delete the password?")) {
      const updatedArray = passwordArray.filter((_, i) => i !== index);
      setPasswordArray(updatedArray);
      localStorage.setItem("passwords", JSON.stringify(updatedArray));
      toast.success("Password Deleted!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      // Remove the corresponding isOpen state entry
      const updatedIsOpenArray = isOpenArray.filter((_, i) => i !== index);
      setIsOpenArray(updatedIsOpenArray);
    }
  };

  // Styles and JSX for the form components
  const inputStyle = `${glassUi} w-full h-10 p-5 text-base`;
  const passwordInputStyle = `${inputStyle} font-mono`;
  const renderInput = (type, name, placeholder, extraStyles = "") => (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      className={`${inputStyle} ${extraStyles}`}
      onChange={handleChange}
      value={form[name]}
    />
  );

  // Function to copy contents to the clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied To Clipboard!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  // Function to toggle password visibility for each row
  const togglePasswordVisibility = (index) => {
    const updatedIsOpenArray = [...isOpenArray];
    updatedIsOpenArray[index] = !updatedIsOpenArray[index]; // Toggle the specific row's visibility
    setIsOpenArray(updatedIsOpenArray);
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="text-white font-sans text-lg ">
        <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>
        {/* Add New Component */}
        <div className="flex items-center justify-start flex-col h-[80vh] gap-y-5">
          <h2 className="font-bold text-lg">Add New Password</h2>
          {error && <p className="text-red-500">{error}</p>}
          {/* Form starts here */}
          <form
            className="flex flex-col bg-slate-600 border border-gray-500 h-1/3 w-2/3 rounded-lg bg-opacity-25 p-10 gap-5"
            onSubmit={savePassword}
          >
            {renderInput("text", "siteURL", "URL of Site")}
            <div className="flex gap-5 items-center py-5">
              {renderInput("text", "userName", "Username")}
              {renderInput(
                isOpen ? "text" : "password",
                "password",
                "Password",
                passwordInputStyle
              )}
              <img
                src={isOpen ? "/hide.png" : "/show.png"}
                width="20px"
                onClick={() => setIsOpen(!isOpen)}
                alt={isOpen ? "Hide password" : "Show password"}
              />
              <button className={`${glassUi} w-1/4 h-10`} type="submit">
                Submit
              </button>
              <button
                className={`${glassUi} w-1/4 h-10`}
                type="button"
                onClick={clearForm}
              >
                Clear Form
              </button>
            </div>
          </form>
          {/* Saved Passwords in localStorage component */}
          <h2 className="font-bold text-lg mb-4">Saved Passwords</h2>
          {passwordArray.length === 0 ? (
            <p>No data Available</p>
          ) : (
            <div className="h-full w-2/3 flex flex-col justify-start items-start overflow-y-scroll text-center">
              {/* Representing passwords in a table */}
              <table className="table-fixed w-full bg-slate-600 border border-gray-500 rounded-lg bg-opacity-25 p-10 text-center">
                {/* Table heading */}
                <thead>
                  <tr>
                    <th className="border border-gray-500">Site</th>
                    <th className="border border-gray-500">Username</th>
                    <th className="border border-gray-500">Password</th>
                    <th className="border border-gray-500">Edit / Delete</th>
                  </tr>
                </thead>
                {/* Table Head End */}
                {/* Table Body */}
                <tbody>
                  {passwordArray.map((item, index) => (
                    <tr key={index} className="border border-gray-500">
                      <td className="border border-gray-500">
                        <div className="flex justify-between">
                          <span className="flex items-center justify-between px-5">
                            {item.siteURL}
                          </span>
                          <div className="w-7">
                            <img
                              src="/copy.png"
                              alt="copy image"
                              className="filter invert cursor-pointer"
                              onClick={() => copyToClipboard(item.siteURL)}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="border border-gray-500">
                        <div className="flex justify-between">
                          <span className="flex items-center justify-between px-5">
                            {item.userName}
                          </span>
                          <div className="w-7">
                            <img
                              src="/copy.png"
                              alt="copy image"
                              className="filter invert cursor-pointer"
                              onClick={() => copyToClipboard(item.userName)}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="border border-gray-500">
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type={isOpenArray[index] ? "text" : "password"}
                            value={item.password}
                            className={`${glassUi} w-full h-5 border-0 outline-none p-5 text-base`}
                            readOnly
                          />

                          <img
                            src={isOpenArray[index] ? "/hide.png" : "/show.png"}
                            width="20px"
                            onClick={() => togglePasswordVisibility(index)}
                            alt={isOpen ? "Hide password" : "Show password"}
                          />
                          <div className="w-7">
                            <img
                              src="/copy.png"
                              alt="copy image"
                              className="filter invert cursor-pointer"
                              onClick={() => copyToClipboard(item.password)}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="border border-gray-500">
                        <div className="flex justify-center">
                          <img
                            src="/dlt.png"
                            alt="delete button"
                            className="cursor-pointer"
                            onClick={() => deletePassword(index)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <button
            className="bg-red-700 h-14 w-1/7 px-5 py-2 border border-gray-500 rounded-xl"
            onClick={clearPasswords}
          >
            Clear ALL Passwords
          </button>
        </div>
      </div>
    </>
  );
};

export default Manager;
