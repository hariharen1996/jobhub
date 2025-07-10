import { useEffect, useState } from "react";
import { jobData } from "../utils/data";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteJob,
  fetchJobs,
  selectFilteredJobs,
  setCurrentPage,
  setEditJob,
} from "../redux/jobsSlice";
import JobCard from "./JobCard";
import Pagination from "./Pagination";
import { useNavigate } from "react-router-dom";
import JobFilters from "../components/JobFilters";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const { status, currentPage, jobsPerPage } = useSelector(
    (state) => state.jobs
  );

  const filteredJobs = useSelector(selectFilteredJobs);

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  const sortedJobs = [...filteredJobs].sort(
    (a, b) => new Date(b.datePosted) - new Date(a.datePosted)
  );

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const lastjob = currentPage * jobsPerPage;
  const firstJob = lastjob - jobsPerPage;
  const currentJobs = sortedJobs.slice(firstJob, lastjob);

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      dispatch(deleteJob(id));
    }
  };

  const handleEdit = (job) => {
    dispatch(setEditJob(job));
    navigate("/job-form");
  };

  return (
    <>
      <h1 className="text-center text-3xl mt-5 font-bold underline">
        Dashboard
      </h1>
      <div className="p-4">
        <div className="flex gap-2 pl-5 mb-6">
          <button
            onClick={() => {
              navigate("/job-form");
              dispatch(setEditJob(null));
            }}
            className="flex items-center gap-2 px-2 py-2 md:px-4 md:py-2 text-sm rounded text-white cursor-pointer home-btn transition hover:bg-blue-600 border-1 border-blue-500"
          >
            <i class="fas fa-plus"></i> Add Job
          </button>
          <button
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-2 px-2 py-2 md:px-4 md:py-2 text-sm rounded text-white cursor-pointer home-btn transition hover:bg-blue-600 border-1 border-blue-500"
          >
            <i class="fas fa-filter"></i> Filter
          </button>
        </div>

        {showFilters && <JobFilters onClose={() => setShowFilters(false)} />}

        {status === "loading" ? (
          <div className="text-center py-8">Loading jobs...</div>
        ) : status === "failed" ? (
          <div className="text-center py-8 text-red-500">
            Error loading jobs
          </div>
        ) : (
          <div className="job-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {currentJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onEdit={() => handleEdit(job)}
                onDelete={() => handleDelete(job.id)}
              />
            ))}
          </div>
        )}
      </div>
      {filteredJobs.length > jobsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
};

export default Dashboard;
