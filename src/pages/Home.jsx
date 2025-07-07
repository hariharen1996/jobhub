import jobhubimage from "../assets/jobhub.jpg";

const Home = () => {
  return (
    <main className="home-container pt-5 pb-5 md:pt-0 md:pb-0 flex flex-col md:flex-row justify-between items-center gap-10 min-h-screen px-[5%]">
      <div className="card max-w-md flex-1">
        <h1 class="text-3xl font-semibold">
          Step into your future with{" "}
          <span className="uppercase font-bold text-blue-600">JobHub</span>
        </h1>
        <p className="text-lg mt-2">Find your dream job now</p>
        <div className="flex gap-3 mt-4">
          <button className="flex items-center gap-2 px-2 py-2 md:px-4 md:py-2 text-sm rounded text-white cursor-pointer home-btn transition hover:bg-blue-600 border-1 border-blue-500">
            <i className="fas fa-user-circle"></i> Create Profile
          </button>
          <button className="flex items-center gap-2 px-2 py-2 md:px-4 md:py-2 text-sm rounded text-white cursor-pointer home-btn transition hover:bg-blue-600 border-1 border-blue-500">
            <i className="fas fa-chart-line"></i> Dashboard
          </button>
        </div>
      </div>

      <div className="flex-5 md:flex-1">
        <img
          src={jobhubimage}
          alt="jobhub"
          className="rounded-xl w-full h-auto max-w-md mx-auto"
        />
      </div>
    </main>
  );
};

export default Home;
