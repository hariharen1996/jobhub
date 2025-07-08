import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;


const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;


const EmployerProfile = () => {
  const { currentUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    companyName: "",
    companyDesc: "",
    companyLocation: "",
    techStack: "",
    employeePhone: "",
    profilePic: null,
  });

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!currentUser) return;

      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);

      const profileRef = doc(db, "employerProfiles", currentUser.uid);
      const profileSnap = await getDoc(profileRef);

      setFormData((prev) => ({
        ...prev,
        username: userSnap.exists() ? userSnap.data().username || "" : "",
        email: userSnap.exists() ? userSnap.data().email || "" : "",
        companyName: profileSnap.exists()
          ? profileSnap.data().companyName || ""
          : "",
        companyDesc: profileSnap.exists()
          ? profileSnap.data().companyDesc || ""
          : "",
        companyLocation: profileSnap.exists()
          ? profileSnap.data().companyLocation || ""
          : "",
        techStack: profileSnap.exists()
          ? profileSnap.data().techStack.join(", ")
          : "",
        employeePhone: profileSnap.exists()
          ? profileSnap.data().employeePhone || ""
          : "",
      }));
    };

    fetchUserInfo();
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateErrors = () => {
    const newErrors = {};
    const {
      companyName,
      companyDesc,
      companyLocation,
      techStack,
      employeePhone,
      profilePic,
    } = formData;

    if (!companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }
    if (!companyLocation.trim()) {
      newErrors.companyLocation = "Company location is required";
    }
    if (!companyDesc.trim()) {
      newErrors.companyDesc = "Company description is required";
    }
    if (!techStack.trim()) {
      newErrors.techStack = "Tech stack is required";
    }
    if (!employeePhone.trim()) {
      newErrors.employeePhone = "Phone number is required";
    } else {
      const phoneReg = /^\d{10,15}$/;
      if (!phoneReg.test(employeePhone)) {
        newErrors.employeePhone = "Enter a valid phone number";
      }
    }

    if (!profilePic) {
      newErrors.profilePic = "Upload your recent profile picture";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const validationErrors = validateErrors();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      let profilePicURL = "";

      if (formData.profilePic) {
        const data = new FormData();
        data.append("file", formData.profilePic);
        data.append("upload_preset", uploadPreset);
        data.append("public_id", `employerPics/${uuidv4()}`);

        const res = await fetch(CLOUDINARY_URL, {
          method: "POST",
          body: data,
        });

        if (!res.ok) {
          throw new Error("Failed to upload profile picture");
        }

        const fileData = await res.json();
        profilePicURL = fileData.secure_url;
      }

      await setDoc(doc(db, "employerProfiles", currentUser.uid), {
        uid: currentUser.uid,
        username: formData.username,
        email: formData.email,
        companyName: formData.companyName,
        companyLocation: formData.companyLocation,
        companyDesc: formData.companyDesc,
        techStack: formData.techStack.split(",").map((skill) => skill.trim()),
        employeePhone: formData.employeePhone,
        profilePicURL,
        createdAt: new Date(),
      });

      setMessage("✅ Employer profile created successfully!");
      setTimeout(() => {
        navigate("/employer-details");
      }, 1500);
    } catch (error) {
      console.error("Profile creation error:", error);
      setMessage("❌ Failed to create employer profile.");
    }
  };

  return (
    <main className="applicant-container min-h-screen flex flex-col justify-center items-center px-4">
      <div className="pt-5">
        {message && (
          <p
            className={`text-center mb-4 ${
              message.startsWith("✅") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-6 mb-4 w-full max-w-md space-y-4"
        >
          <h2 className="text-2xl font-bold text-center mb-4">
            Employer Profile
          </h2>

          <div>
            <input
              type="text"
              name="username"
              value={formData.username}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          <div>
            <input
              type="text"
              name="email"
              value={formData.email}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          <div>
            <input
              type="text"
              name="employeePhone"
              value={formData.employeePhone}
              onChange={handleChange}
              placeholder="Enter employer phone"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {errors.employeePhone && (
              <p className="text-red-500 text-xs mt-1">
                *{errors.employeePhone}
              </p>
            )}
          </div>

          <div>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Enter company name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {errors.companyName && (
              <p className="text-red-500 text-xs mt-1">*{errors.companyName}</p>
            )}
          </div>

          <div>
            <textarea
              name="companyDesc"
              value={formData.companyDesc}
              onChange={handleChange}
              rows={3}
              placeholder="About Company"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {errors.companyDesc && (
              <p className="text-red-500 text-xs mt-1">*{errors.companyDesc}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              name="companyLocation"
              value={formData.companyLocation}
              onChange={handleChange}
              placeholder="Enter company location"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {errors.companyLocation && (
              <p className="text-red-500 text-xs mt-1">
                *{errors.companyLocation}
              </p>
            )}
          </div>

          <div>
            <input
              type="text"
              name="techStack"
              value={formData.techStack}
              onChange={handleChange}
              placeholder="Tech stack: e.g. React, Firebase"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {errors.techStack && (
              <p className="text-red-500 text-xs mt-1">*{errors.techStack}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Profile Picture</label>
            <input
              type="file"
              name="profilePic"
              accept="image/*"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {errors.profilePic && (
              <p className="text-red-500 text-xs mt-1">*{errors.profilePic}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded text-white cursor-pointer home-btn transition hover:bg-blue-600 border-2 border-blue-500"
          >
            Create Profile
          </button>
        </form>
      </div>
    </main>
  );
};

export default EmployerProfile;
