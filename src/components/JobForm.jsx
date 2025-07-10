import { collection, addDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import { addJob, clearEditJob, updateJob } from "../redux/jobsSlice";
import { useDispatch, useSelector } from "react-redux";

const JobForm = () => {
  const navigate = useNavigate();
  const { status, editJob } = useSelector((state) => state.jobs);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    jobTitle: "",
    companyName: "",
    experience: "",
    location: "",
    jobDescription: "",
    jobSkills: "",
    numberOfOpenings: 1,
    workMode: "hybrid",
    salary: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (editJob) {
      setFormData({
        ...editJob,
        jobSkills: Array.isArray(editJob.jobSkills)
          ? editJob.jobSkills.join(", ")
          : editJob.jobSkills,
      });
    }
  }, [editJob]);

  const handleCancel = () => {
    dispatch(clearEditJob());
    navigate("/dashboard");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    const jobData = {
      ...formData,
      jobSkills: formData.jobSkills.split(",").map((skill) => skill.trim()),
      datePosted: new Date().toISOString(),
      postedBy: user?.uid || "anonymous",
    };

    try {
      if (editJob) {
         dispatch(updateJob({ id: editJob.id, ...jobData }));
         setMessage("✅ Job updated successfully");
      } else {
         dispatch(addJob(jobData));
         setMessage("✅ Job posted successfully");
      }

      if (!editJob) {
        setFormData({
          jobTitle: "",
          companyName: "",
          experience: "",
          location: "",
          jobDescription: "",
          jobSkills: "",
          numberOfOpenings: 1,
          workMode: "hybrid",
          salary: "",
        });
      }
      
      setTimeout(() => {
        dispatch(clearEditJob())
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to create job post");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-md rounded-lg my-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {editJob ? "Edit Job" : "Post a New Job"}
      </h2>

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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Title
            </label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              placeholder="e.g. Software Developer"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="e.g. TCS"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Experience Required
            </label>
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="e.g., 2-5 years"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Chennai, Tamil Nadu"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Job Description
          </label>
          <textarea
            name="jobDescription"
            value={formData.jobDescription}
            onChange={handleChange}
            rows="4"
            placeholder="Describe the responsibilities, requirements, and expectations for this job role..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Skills Required (comma separated)
          </label>
          <input
            type="text"
            name="jobSkills"
            value={formData.jobSkills}
            onChange={handleChange}
            placeholder="e.g., React, JavaScript, HTML"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Openings
            </label>
            <input
              type="number"
              name="numberOfOpenings"
              value={formData.numberOfOpenings}
              onChange={handleChange}
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Salary Range
            </label>
            <input
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="e.g., ₹6,00,000 - ₹10,00,000"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Work Mode
          </label>
          <select
            name="workMode"
            value={formData.workMode}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="wfo">Work From Office</option>
          </select>
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="px-6 py-2 m-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            disabled={status === "loading"}
          >
            {status === "loading"
              ? "Processing..."
              : editJob
              ? "Update Job"
              : "Post Job"}
          </button>
          {editJob && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 m-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default JobForm;
