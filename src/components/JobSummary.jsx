import { useSelector } from "react-redux";

const JobSummary = ({ totalJobs, firstJob, lastJob }) => {
  const { filters } = useSelector((state) => state.jobs);

  const getFilterNames = () => {
    const names = [];

    if (filters.searchQuery) {
      names.push(`Search: "${filters.searchQuery}`);
    }

    if (filters.experience) {
      names.push(`Experience: "${filters.experience}`);
    }

    if (
      filters.salaryRange &&
      (filters.salaryRange[0] > 0 || filters.salaryRange[1] < 100)
    ) {
      names.push(
        `Salary: ₹${filters.salaryRange[0]}L - ₹${filters.salaryRange[1]}L`
      );
    }
    if (filters.location.length > 0) {
      names.push(`Location: ${filters.location.join(", ")}`);
    }
    if (filters.skills.length > 0) {
      names.push(`Skills: ${filters.skills.join(", ")}`);
    }
    if (filters.workMode && filters.workMode !== "all") {
      names.push(`Work Mode: ${filters.workMode}`);
    }

    return names.length > 0 ? names : ["No filters applied"];
  };

  return (
    <p className="font-semibold text-sm mb-4 px-5">
      {totalJobs === 0
        ? "0"
        : `${firstJob + 1} - ${Math.min(
            lastJob,
            totalJobs
          )} of ${totalJobs}`}{" "}
      jobs |{" "}
      {getFilterNames().map((name, idx, arr) => (
        <span key={idx}>
          {name}
          {idx < arr.length - 1 && ", "}
        </span>
      ))}
    </p>
  );
};

export default JobSummary