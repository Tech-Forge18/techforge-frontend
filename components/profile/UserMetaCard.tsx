"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Label from "../form/Label";
import Image from "next/image";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { toast } from "@/components/ui/use-toast";

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

interface InputProps {
  type: string;
  name: string;
  value: string | number;  // Updated to accept string | number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = ({ type, name, value, onChange }: InputProps) => {
  return (
    <input
      type={type}
      name={name}
      value={value.toString()}  // Convert value to string for the input
      onChange={onChange}
      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:placeholder-gray-500 dark:focus:ring-indigo-400"
    />
  );
};

export default function UserMetaCard() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get<ProfileData>(`${apiUrl}/profiles/1/`);
        setProfileData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
        setError("Failed to fetch profile data. Please try again later.");
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [apiUrl]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) =>
      prev
        ? {
            ...prev,
            [name]: name === "id" ? Number(value) : value, // Convert to number for 'id' field
          }
        : null
    );
  };

  const handleSave = async () => {
    if (!profileData) return;
    try {
      await axios.patch(`${apiUrl}/profiles/${profileData.id}/`, profileData);
      toast({
        title: "Success",
        description: "Profile updated successfully",
        className:
          "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800",
      });
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="text-lg font-medium text-gray-600 dark:text-gray-300 animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="text-lg font-medium text-red-500 bg-red-50 dark:bg-red-900/20 px-6 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="text-lg font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-6 py-3 rounded-lg">
          No profile data found.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center justify-between">
          {/* Profile Info */}
          <div className="flex flex-col md:flex-row items-center gap-6 w-full">
            <div className="relative w-24 h-24 flex-shrink-0">
              <Image
                width={96}
                height={96}
                src="/images/user/owner.jpg"
                alt="user"
                className="rounded-full object-cover border-2 border-indigo-500/10 shadow-md"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
            </div>

            <div className="text-center md:text-left flex-1">
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {profileData.firstname} {profileData.lastname}
              </h4>
              <div className="flex flex-col md:flex-row items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <span className="bg-indigo-50 dark:bg-indigo-900/20 px-2.5 py-1 rounded-md text-indigo-700 dark:text-indigo-300">
                  {profileData.position}
                </span>
                <span className="hidden md:block h-4 w-px bg-gray-200 dark:bg-gray-700"></span>
                <span>
                  {profileData.state}, {profileData.country}
                </span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {[
                { icon: FaFacebookF, link: profileData.facebook, color: "hover:text-[#1877F2]" },
                { icon: FaTwitter, link: profileData.twitter, color: "hover:text-[#1DA1F2]" },
                { icon: FaLinkedinIn, link: profileData.linkedin, color: "hover:text-[#0A66C2]" },
                { icon: FaInstagram, link: profileData.instagram, color: "hover:text-[#E4405F]" },
              ].map(
                (social, index) =>
                  social.link && (
                    <a
                      key={index}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <button
                        className={`w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 ${social.color} hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-200`}
                      >
                        <social.icon className="w-5 h-5" />
                      </button>
                    </a>
                  )
              )}
            </div>
          </div>

          {/* Edit Button */}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg px-6 py-2.5 shadow-md transition-all duration-200">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 18 18">
                  <path d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206Z" />
                </svg>
                Edit Profile
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-[90vw] sm:max-w-2xl rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold text-gray-900 dark:text-white bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                  Edit Profile
                </DialogTitle>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Update your personal information and social links
                </p>
              </DialogHeader>

              <div className="mt-6 max-h-[60vh] overflow-y-auto space-y-8">
                {[
                  {
                    title: "Social Links",
                    fields: ["facebook", "twitter", "linkedin", "instagram"],
                  },
                  {
                    title: "Personal Information",
                    fields: ["firstname", "lastname", "email", "phone", "position"],
                  },
                  {
                    title: "Address",
                    fields: ["country", "state", "postalcode", "taxid"],
                  },
                ].map((section) => (
                  <div key={section.title}>
                    <h5 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      {section.title}
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {section.fields.map((field) => (
                        <div key={field}>
                          <Label className="text-sm text-gray-600 dark:text-gray-400 mb-1.5">
                            {field.charAt(0).toUpperCase() +
                              field.slice(1).replace("postalcode", "Postal Code")}
                          </Label>
                          <Input
                            type="text"
                            name={field}
                            value={profileData[field as keyof ProfileData]}
                            onChange={handleInputChange}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg"
                >
                  Save Changes
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}