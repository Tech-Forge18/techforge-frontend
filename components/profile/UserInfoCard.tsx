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
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-lg font-medium text-gray-600 dark:text-gray-300 animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-lg font-medium text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  if (!profileData || profileData.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-lg font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-md">
          No profile data found.
        </div>
      </div>
    );
  }

  const profile = profileData[0];

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
        {/* Personal Information Section */}
        <section className="p-6 md:p-8">
          <h4 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Personal Information
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {["firstname", "lastname", "email", "phone", "position"].map((key) => (
              <div 
                key={key} 
                className="group bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/70 transition-colors duration-200"
              >
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                  {key.replace("_", " ")}
                </p>
                <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white break-words">
                  {profile[key as keyof ProfileData]}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent mx-6 md:mx-8"></div>

        {/* Address Section */}
        <section className="p-6 md:p-8">
          <h4 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Address
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {["country", "state", "postalcode", "taxid"].map((key) => (
              <div 
                key={key} 
                className="group bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/70 transition-colors duration-200"
              >
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                  {key.replace("_", " ")}
                </p>
                <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white break-words">
                  {profile[key as keyof ProfileData]}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}