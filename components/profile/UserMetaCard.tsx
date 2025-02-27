"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Label from "../form/Label"
import Image from "next/image"
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa"
import { toast } from "@/components/ui/use-toast"

interface ProfileData {
  id: number
  firstname: string
  lastname: string
  email: string
  phone: string
  position: string
  country: string
  state: string
  postalcode: string
  taxid: string
  facebook: string
  twitter: string
  instagram: string
  linkedin: string
}

interface InputProps {
  type: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const Input = ({ type, name, value, onChange }: InputProps) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
    />
  )
}

export default function UserMetaCard() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get<ProfileData>(`${apiUrl}/profiles/1/`)
        setProfileData(response.data)
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch profile data:", error)
        setError("Failed to fetch profile data. Please try again later.")
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [apiUrl])

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  // Handle form submission
  const handleSave = async () => {
    if (!profileData) return

    try {
      await axios.patch(`${apiUrl}/profiles/${profileData.id}/`, profileData)
      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
      setIsOpen(false)
    } catch (error) {
      console.error("Failed to update profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
  }

  if (!profileData) {
    return <div className="flex justify-center items-center h-screen">No profile data found.</div>
  }

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
          <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800 shadow-md">
            <Image
              width={80}
              height={80}
              src="/images/user/owner.jpg"
              alt="user"
              className="object-cover"
            />
          </div>
          <div className="order-3 xl:order-2">
            <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
              {profileData.firstname} {profileData.lastname}
            </h4>
            <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
              <p className="text-sm text-gray-500 dark:text-gray-400">{profileData.position}</p>
              <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {profileData.state}, {profileData.country}
              </p>
            </div>
          </div>
          <div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end">
            {profileData.facebook && (
              <a href={profileData.facebook} target="_blank" rel="noopener noreferrer">
                <button className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 transition-colors duration-300">
                  <FaFacebookF />
                </button>
              </a>
            )}
            {profileData.twitter && (
              <a href={profileData.twitter} target="_blank" rel="noopener noreferrer">
                <button className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 transition-colors duration-300">
                  <FaTwitter />
                </button>
              </a>
            )}
            {profileData.linkedin && (
              <a href={profileData.linkedin} target="_blank" rel="noopener noreferrer">
                <button className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 transition-colors duration-300">
                  <FaLinkedinIn />
                </button>
              </a>
            )}
            {profileData.instagram && (
              <a href={profileData.instagram} target="_blank" rel="noopener noreferrer">
                <button className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 transition-colors duration-300">
                  <FaInstagram />
                </button>
              </a>
            )}
          </div>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto transition-colors duration-300"
            >
              <svg
                className="fill-current"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                  fill=""
                />
              </svg>
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[700px] rounded-3xl bg-white dark:bg-gray-900 p-4 lg:p-11">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                Edit Personal Information
              </DialogTitle>
            </DialogHeader>
            <div className="mt-2 px-2">
              <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                Update your details to keep your profile up-to-date.
              </p>
            </div>
            <div className="h-[450px] overflow-y-auto px-2 pb-3">
              {/* Social Links */}
              <div>
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Social Links
                </h5>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Label>Facebook</Label>
                    <Input
                      type="text"
                      name="facebook"
                      value={profileData.facebook}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label>X.com</Label>
                    <Input
                      type="text"
                      name="twitter"
                      value={profileData.twitter}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label>Linkedin</Label>
                    <Input
                      type="text"
                      name="linkedin"
                      value={profileData.linkedin}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label>Instagram</Label>
                    <Input
                      type="text"
                      name="instagram"
                      value={profileData.instagram}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              {/* Personal Information */}
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Personal Information
                </h5>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Label>First Name</Label>
                    <Input
                      type="text"
                      name="firstname"
                      value={profileData.firstname}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input
                      type="text"
                      name="lastname"
                      value={profileData.lastname}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label>Email Address</Label>
                    <Input
                      type="text"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      type="text"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label>Position</Label>
                    <Input
                      type="text"
                      name="position"
                      value={profileData.position}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              {/* Address Information */}
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Address
                </h5>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Label>Country</Label>
                    <Input
                      type="text"
                      name="country"
                      value={profileData.country}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label>State</Label>
                    <Input
                      type="text"
                      name="state"
                      value={profileData.state}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label>Postal Code</Label>
                    <Input
                      type="text"
                      name="postalcode"
                      value={profileData.postalcode}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label>Tax ID</Label>
                    <Input
                      type="text"
                      name="taxid"
                      value={profileData.taxid}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={() => setIsOpen(false)}>
                Close
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}