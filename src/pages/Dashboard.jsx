import { useEffect, useState } from "react";
import { jobData } from "../utils/data";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs, setCurrentPage } from "../redux/jobsSlice";
import JobCard from "./JobCard";
import Pagination from "./Pagination";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { jobs, status, currentPage, jobsPerPage } = useSelector(
    (state) => state.jobs
  );

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  const totalPages = Math.ceil(jobs.length / jobsPerPage);
  const lastjob = currentPage * jobsPerPage;
  const firstJob = lastjob - jobsPerPage;
  const currentJobs = jobs.slice(firstJob, lastjob);

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };

  return (
    <>
      <h1 className="text-center text-3xl mt-5 font-bold underline">Dashboard</h1>
      <div className="p-4">
        {status === "loading" ? (
          <div className="text-center py-8">Loading jobs...</div>
        ) : status === "failed" ? (
          <div className="text-center py-8 text-red-500">
            Error loading jobs
          </div>
        ) : (
          <div className="job-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {currentJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
      {jobs.length > jobsPerPage && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      )}
      
    </>
  );
};

export default Dashboard;
