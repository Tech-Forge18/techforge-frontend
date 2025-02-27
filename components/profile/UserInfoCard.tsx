"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface ProfileData {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  position: string;
  country: string;
  state: string;
  postalcode: string;
  taxid: string;
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
}

export default function UserInfoAndAddressCard() {
  const [profileData, setProfileData] = useState<ProfileData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<ProfileData[]>("http://127.0.0.1:8000/api/profiles/")
      .then((response) => {
        setProfileData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch profile data. Please try again later.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-lg text-center text-gray-700 dark:text-gray-300">Loading...</div>;
  }

  if (error) {
    return <div className="text-lg text-center text-red-500">{error}</div>;
  }

  if (!profileData || profileData.length === 0) {
    return <div className="text-lg text-center text-gray-500">No profile data found.</div>;
  }

  const profile = profileData[0];

  return (
    <div className="space-y-6 p-6 bg-white dark:bg-gray-900 shadow-lg rounded-xl">
      <div className="p-6 border border-gray-300 dark:border-gray-700 rounded-xl shadow-md">
        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Personal Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {["firstname", "lastname", "email", "phone", "position"].map((key) => (
            <div key={key}>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{key.replace("_", " ")}</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">{profile[key as keyof ProfileData]}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 border border-gray-300 dark:border-gray-700 rounded-xl shadow-md">
        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Address</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {["country", "state", "postalcode", "taxid"].map((key) => (
            <div key={key}>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{key.replace("_", " ")}</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">{profile[key as keyof ProfileData]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
