const JobCard = ({ job }) => {
  console.log(job);
  const postedDate = new Date(job.datePosted);
  const currentDate = new Date();
  const daysAgo = Math.floor(
    (currentDate - postedDate) / (1000 * 60 * 60 * 24)
  );
  return (
    <div
      className="job-card bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-blue-500"
      key={job.id}
    >
      <div className="top flex justify-between items-start mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">{job.jobTitle}</h1>
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

      <p className="text-gray-700 mb-4 line-clamp-3">{job.jobDescription}</p>

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
          <p className="text-sm font-semibold text-blue-600">{job.salary}</p>
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
};

export default JobCard;
