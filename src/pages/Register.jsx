import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "applicant",
  });

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!form.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[a-z\d\-]+@[a-z\d\-]+\.[a-z]{2,8}(\.[a-z]{2,8})?$/.test(form.email)
    ) {
      newErrors.email = "Invalid email";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be minimum 6 characters length";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "ConfirmPassword is required";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords must match";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    const validateErrors = validate();

    if (Object.keys(validateErrors).length > 0) {
      setErrors(validateErrors);
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const user = userCred.user;

      try {
        await setDoc(doc(db, "users", user.uid), {
          username: form.username,
          email: form.email,
          role: form.role,
          createdAt: new Date(),
          uid: user.uid,
        });

        setForm({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "applicant",
        });
        setErrors({});
        setSuccessMsg("Registered Successfully!");

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (firestoreError) {
        await user.delete();
        setErrors({
          common: "Failed to create user profile. Please try again.",
        });
      }
    } catch (authError) {
      let errorMessage = "Registration failed. Please try again.";

      if (authError.code === "auth/email-already-in-use") {
        errorMessage = "Email is already in use.";
      } else if (authError.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters.";
      }

      setErrors({ common: errorMessage });
    }
  };

  return (
    <main className="register-container min-h-screen flex flex-col justify-center items-center px-4">
      {successMsg && (
        <p className="text-green-600 text-center text-sm font-medium mb-4">
          ✅ {successMsg}
        </p>
      )}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-6 mb-4 w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
        <div className="mb-4">
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.username && (
            <p className="text-red-500 text-xs mt-1">*{errors.username}</p>
          )}
        </div>

        <div className="mb-4">
          <input
            type="text"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">*{errors.email}</p>
          )}
        </div>

        <div className="mb-4">
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">*{errors.password}</p>
          )}
        </div>
        <div className="mb-4">
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="ConfirmPassword"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">
              *{errors.confirmPassword}
            </p>
          )}
        </div>
        <div className="mb-4">
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="applicant">Applicant</option>
            <option value="employer">Employer</option>
          </select>
        </div>
        <button
          type="submit"
          className="flex items-center  gap-2 px-4 py-2 rounded text-white cursor-pointer home-btn transition hover:bg-blue-600 border-2 border-blue-500"
        >
          Register
        </button>
        {errors.common && (
          <p className="text-red-500 text-xs mt-1">*{errors.common}</p>
        )}
      </form>
      <p className="text-sm text-gray-700">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-500 hover:underline">
          Login
        </Link>
      </p>
    </main>
  );
};

export default Register;
