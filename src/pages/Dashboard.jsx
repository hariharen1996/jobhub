import { useState } from "react";
import { jobData } from "../utils/data";

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const jobsPerPage = 6;
  const totalPages = Math.ceil(jobData.length / jobsPerPage);
  console.log(totalPages);

  const lastjob = currentPage * jobsPerPage;
  console.log(lastjob);
  const firstJob = lastjob - jobsPerPage;
  console.log(firstJob);
  const currentJobs = jobData.slice(firstJob, lastjob);
  console.log(currentJobs);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <>
      <div className="job-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {currentJobs.map((job) => {
          const postedDate = new Date(job.datePosted);
          const currentDate = new Date();
          //console.log(postedDate,currentDate)
          const daysAgo = Math.floor(
            (currentDate - postedDate) / (1000 * 60 * 60 * 24)
          );
          //console.log(daysAgo)
          return (
            <div
              className="job-card bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-blue-500"
              key={job.id}
            >
              <div className="top flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-xl font-bold text-gray-800">
                    {job.jobTitle}
                  </h1>
                  <p className="text-md text-gray-600">{job.companyName}</p>
                </div>
                <div className="bg-blue-600 p-3 rounded-md flex items-center justify-center">
                  <p className="text-white font-bold text-lg">
                    {job.companyName.slice(0, 1).toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="middle flex flex-wrap gap-2 mb-4">
                <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                  {job.experience}
                </span>
                <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
                  {job.location.split(",")[0]}
                </span>
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    job.workMode === "remote"
                      ? "bg-purple-100 text-purple-800"
                      : job.workMode === "hybrid"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {job.workMode.toUpperCase()}
                </span>
              </div>

              <p className="text-gray-700 mb-4 line-clamp-3">
                {job.jobDescription}
              </p>

              <div className="skills flex flex-wrap gap-2 mb-4">
                {job.jobSkills.slice(0, 4).map((skill, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded"
                  >
                    {skill}
                  </span>
                ))}
                {job.jobSkills.length > 4 && (
                  <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">
                    +{job.jobSkills.length - 4} more
                  </span>
                )}
              </div>

              <div className="bottom flex justify-between items-center">
                <div>
                  <p className="text-sm font-semibold text-blue-600">
                    {job.salary}
                  </p>
                  <p className="text-xs text-gray-500">
                    {job.numberOfOpenings} opening
                    {job.numberOfOpenings > 1 ? "s" : ""}
                  </p>
                </div>
                <p className="text-xs text-gray-500">
                  Posted{" "}
                  {daysAgo === 0
                    ? "today"
                    : `${daysAgo} day${daysAgo > 1 ? "s" : ""} ago`}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center items-center flex-wrap gap-2 mb-2">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-md ${
            currentPage === 1
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => paginate(num)}
            className={`px-4 py-2 rounded-md ${
              currentPage === num
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {num}
          </button>
        ))}
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-md ${
            currentPage === totalPages
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          Next
        </button>
      </div>
      <div className="text-center text-sm mt-4 mb-4 text-gray-600">
          Showing {firstJob + 1}-{Math.min(lastjob,jobData.length)} of {jobData.length} jobs
        </div>
        
    </>
  );
};

export default Dashboard;
