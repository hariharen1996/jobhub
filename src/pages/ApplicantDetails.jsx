import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Spinner from "../components/Spinner";
import userImage from '../assets/user.png'

const ApplicantDetails = () => {
  const { currentUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading,setLoading] = useState(true)

  useEffect(() => {
    if (!currentUser) return;

    const fetchProfile = async () => {
      setLoading(true)
      try {
        const profileRef = doc(db, "applicantProfiles", currentUser.uid);
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
  if (!profile) return <p className="text-center text-lg text-red-500 py-4">No applicant profile found...Please create applicant profile</p>;

  return (
    <div className="max-w-4xl mx-auto mt-5 mb-5 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Applicant Details</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex flex-col items-center">
          <img
            src={profile.profilePicURL || userImage}
            alt="Profile"
            className="w-40 h-40 rounded-full object-cover border-4 border-blue-100"
            onError={(e) => {
              e.target.src =  `${userImage}`;
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
              <h3 className="font-semibold text-gray-600">Address</h3>
              <p className="mt-1">{profile.address}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-600">Bio</h3>
              <p className="mt-1 whitespace-pre-line">{profile.bio}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-600">Experience</h3>
              <p className="mt-1 whitespace-pre-line">{profile.experience}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-600">Skills</h3>
              <p className="mt-1">{profile.skills?.join(", ")}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-600">Phone</h3>
              <p className="mt-1">{profile.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDetails;