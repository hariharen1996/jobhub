import { useEffect, useState } from "react";
import { jobData } from "../utils/data";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteJob,
  fetchJobs,
  setCurrentPage,
  setEditJob,
} from "../redux/jobsSlice";
import JobCard from "./JobCard";
import Pagination from "./Pagination";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { jobs, status, currentPage, jobsPerPage } = useSelector(
    (state) => state.jobs
  );

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  const sortedJobs = [...jobs].sort(
    (a, b) => new Date(b.datePosted) - new Date(a.datePosted)
  );

  const totalPages = Math.ceil(jobs.length / jobsPerPage);
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
        <div className="flex justify-between items-center pl-5 mb-6">
          <button
            onClick={() => {
              navigate("/job-form");
              dispatch(setEditJob(null));
            }}
            className="px-2 py-2 md:px-4 md:py-2 text-sm rounded text-white cursor-pointer home-btn transition hover:bg-blue-600 border-1 border-blue-500"
          >
            Create Job
          </button>
        </div>

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
      {jobs.length > jobsPerPage && (
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
