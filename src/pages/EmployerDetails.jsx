import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import userImage from '../assets/user.png'
import Spinner from "../components/Spinner";

const EmployerDetails = () => {
  const { currentUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading,setLoading] = useState(true)

  useEffect(() => {
    if (!currentUser) return;
    const fetchProfile = async () => {
      setLoading(true)
      try {
        const profileRef = doc(db, "employerProfiles", currentUser.uid);
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          setProfile(profileSnap.data());
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error("Error fetching profile", err);
      }finally{
        setLoading(false)
      }
    };

    fetchProfile();
  }, [currentUser]);

  if (loading) return <Spinner />;
  if (!profile) return <p className="text-center text-red-500 py-4">No employer profile found. Please create employer profile</p>;

  return (
    <div className="max-w-4xl mx-auto mt-5 mb-5 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Employer Profile</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex flex-col items-center">
          <img
            src={profile.profilePicURL || userImage}
            alt="Profile"
            className="w-40 h-40 rounded-full object-cover border-4 border-blue-100"
            onError={(e) => {
              e.target.src = `${userImage}`;
            }}
          />
        </div>

        <div className="flex-1">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-600">Username</h3>
                <p className="mt-1">{profile.username}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-600">Email</h3>
                <p className="mt-1">{profile.email}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-600">Company Name</h3>
              <p className="mt-1 font-medium text-blue-600">{profile.companyName}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-600">Company Description</h3>
              <p className="mt-1 whitespace-pre-line">{profile.companyDesc}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-600">Company Location</h3>
              <p className="mt-1">{profile.companyLocation}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-600">Tech Stack</h3>
              <div className="mt-1 flex flex-wrap gap-2">
                {profile.techStack?.map((tech, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-600">Contact Phone</h3>
              <p className="mt-1">
                <a 
                  href={`tel:${profile.employeePhone}`}
                  className="text-blue-600 hover:underline"
                >
                  {profile.employeePhone}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDetails;