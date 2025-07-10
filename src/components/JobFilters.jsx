import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilters, resetFilters } from "../redux/jobsSlice";

const JobFilters = ({ onClose }) => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.jobs.filters);

  const jobs = useSelector((state) => state.jobs.jobs);

  const allSkills = [...new Set(jobs.flatMap((job) => job.jobSkills || []))];

  const allLocations = [
    ...new Set(jobs.map((job) => job.location?.split(",")[0]?.trim())),
  ];

  const [localFilters, setLocalFilters] = useState(filters);

  const updateLocal = (key, value) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleArrayValue = (key, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  const handleApplyFilters = () => {
    dispatch(setFilters(localFilters));
    onClose();
  };

  const handleReset = () => {
    dispatch(resetFilters());
    setLocalFilters({
      searchQuery: "",
      experience: "",
      salaryRange: [0, 100],
      location: [],
      skills: [],
      workMode: "all",
    });
  };

  console.log(jobs);

  return (
    <div className="filter-sidebar fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50">
      <aside className="filter-container bg-white max-w-sm w-full h-full shadow-lg p-6 overflow-y-auto animate-slide-in">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">All Filters</h3>
          <button onClick={onClose}>
            <i className="fas fa-times text-gray-500"></i>
          </button>
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-lg underline font-bold">
            Search...
          </label>
          <input
            type="text"
            placeholder="Job title or company"
            value={localFilters.searchQuery}
            onChange={(e) => updateLocal("searchQuery", e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-lg underline font-bold">
            Work Mode
          </label>
          {["all", "remote", "hybrid", "wfo"].map((mode) => (
            <div key={mode} className="flex items-center">
              <input
                type="radio"
                name="workMode"
                checked={localFilters.workMode === mode}
                onChange={() => updateLocal("workMode", mode)}
              />
              <label className="ml-2">
                {mode === "all" ? "All" : mode.toUpperCase()}
              </label>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-lg underline font-bold">
            Experience
          </label>
          <select
            value={localFilters.experience}
            onChange={(e) => updateLocal("experience", e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="">All Experience</option>
            <option value="2">0-2 years</option>
            <option value="5">2-5 years</option>
            <option value="5+">5+ years</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="text-lg underline font-bold">
            Salary Range (LPA): {localFilters.salaryRange[0]} -{" "}
            {localFilters.salaryRange[1]}
          </label>
          <div className="flex flex-col gap-4">
            <input
              type="range"
              min="0"
              max="50"
              value={localFilters.salaryRange[0]}
              onChange={(e) =>
                updateLocal("salaryRange", [
                  Number(e.target.value),
                  localFilters.salaryRange[1],
                ])
              }
            />
            <input
              type="range"
              min="0"
              max="50"
              value={localFilters.salaryRange[1]}
              onChange={(e) =>
                updateLocal("salaryRange", [
                  localFilters.salaryRange[0],
                  Number(e.target.value),
                ])
              }
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-lg underline font-bold">
            Locations
          </label>
          {allLocations.map((loc) => (
            <div key={loc} className="flex items-center">
              <input
                type="checkbox"
                checked={localFilters.location.includes(loc)}
                onChange={() => toggleArrayValue("location", loc)}
              />
              <label className="ml-2">{loc}</label>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-lg font-bold underline">
            Skills
          </label>
          {allSkills.length > 0 ? (
            allSkills.map((skill) => (
              <div key={skill} className="flex items-center">
                <input
                  type="checkbox"
                  checked={localFilters.skills.includes(skill)}
                  onChange={() => toggleArrayValue("skills", skill)}
                />
                <label className="ml-2">{skill}</label>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No skills found</p>
          )}
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-200 text-sm rounded hover:bg-gray-300"
          >
            Reset
          </button>
          <button
            onClick={handleApplyFilters}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>
      </aside>
    </div>
  );
};

export default JobFilters;
