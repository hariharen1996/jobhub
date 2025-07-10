import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const ApplicantProfile = () => {
  const { currentUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    address: "",
    bio: "",
    experience: "",
    skills: "",
    phone: "",
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

      const profileRef = doc(db, "applicantProfiles", currentUser.uid);
      const profileSnap = await getDoc(profileRef);

      setFormData((prev) => ({
        ...prev,
        username: userSnap.exists() ? userSnap.data().username || "" : "",
        email: userSnap.exists() ? userSnap.data().email || "" : "",
        address: profileSnap.exists() ? profileSnap.data().address || "" : "",
        bio: profileSnap.exists() ? profileSnap.data().bio || "" : "",
        experience: profileSnap.exists()
          ? profileSnap.data().experience || ""
          : "",
        skills: profileSnap.exists()
          ? profileSnap.data().skills.join(", ")
          : "",
        phone: profileSnap.exists() ? profileSnap.data().phone || "" : "",
        profilePic: profileSnap.exists()
          ? profileSnap.data().profilePicURL || ""
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
    const { address, bio, experience, skills, phone, profilePic } = formData;

    if (!address.trim()) {
      newErrors.address = "Address is required";
    }
    if (!bio.trim()) {
      newErrors.bio = "Bio is required";
    } else if (bio.trim().length < 20) {
      newErrors.bio = "Bio should be at least 20 characters";
    }
    if (!experience.trim()) {
      newErrors.experience = "Experience is required";
    }
    if (!skills.trim()) {
      newErrors.skills = "Skills are required";
    }
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else {
      const phoneReg = /^\d{10,15}$/;
      if (!phoneReg.test(phone)) {
        newErrors.phone = "Enter a valid phone number";
      }
    }
    if (!profilePic) {
      newErrors.profilePic = "Profile picture is required";
    }
    return newErrors;
  };

  const uploadFileToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", uploadPreset);

    const isImage = file.type.startsWith("image/");

    const url = isImage
      ? `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
      : `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`;

    try {
      const res = await fetch(url, {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Upload failed");
      }

      const json = await res.json();
      return json.secure_url;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
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
        profilePicURL = await uploadFileToCloudinary(formData.profilePic);
      }

      await setDoc(doc(db, "applicantProfiles", currentUser.uid), {
        uid: currentUser.uid,
        username: formData.username,
        email: formData.email,
        address: formData.address,
        bio: formData.bio,
        experience: formData.experience,
        skills: formData.skills.split(",").map((skill) => skill.trim()),
        phone: formData.phone,
        profilePicURL,
        createdAt: new Date(),
      });

      setMessage("✅ Applicant profile created successfully!");
      setTimeout(() => {
        navigate("/applicant-details");
      }, 1500);
    } catch (error) {
      console.error("Profile creation error:", error);
      setMessage("❌ Failed to create applicant profile.");
    }
  };

  return (
    <main className="applicant-container min-h-screen flex flex-col justify-center items-center px-4">
      <div className="pt-5">
        {message && (
          <div
            className={`mb-4 text-sm px-4 py-2 rounded ${
              message.includes("✅")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-6 mb-4 w-full max-w-md space-y-4"
        >
          <h2 className="text-2xl font-bold text-center mb-4">
            Applicant Profile
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
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your address"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">*{errors.address}</p>
            )}
          </div>

          <div>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              placeholder="Tell us about yourself"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {errors.bio && (
              <p className="text-red-500 text-xs mt-1">*{errors.bio}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="Your work experience"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {errors.experience && (
              <p className="text-red-500 text-xs mt-1">*{errors.experience}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="Your skills (comma separated)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {errors.skills && (
              <p className="text-red-500 text-xs mt-1">*{errors.skills}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Your phone number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">*{errors.phone}</p>
            )}
          </div>

          <div className="flex">
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

export default ApplicantProfile;
