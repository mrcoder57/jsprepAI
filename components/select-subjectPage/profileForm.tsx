'use client'

import React from 'react'
import { Select, SelectContent, SelectTrigger, SelectItem, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from 'sonner'

interface ProfileFormProps {
  profileData: { fullName: string; country: string }
  setProfileData: React.Dispatch<React.SetStateAction<{ fullName: string; country: string }>>
  nextStep: () => void
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  profileData,
  setProfileData,
  nextStep,
}) => {
  // Handler for input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  // Handler for country selection
  const handleCountryChange = (value: string) => {
    setProfileData((prev) => ({ ...prev, country: value }))
  }

  // Validate and move to the next step
  const handleNext = () => {
    if (!profileData.fullName || !profileData.country) {
      toast.error('Please fill out all fields')
      return
    }
    nextStep()
  }

  return (
    <Card className="w-full max-w-6xl  shadow-none border-none">
      <CardHeader className=' gap-y-3 '>
        <CardTitle className=' text-[26px] font-[600]  '>Create Your Profile</CardTitle>
        <CardDescription >Fill in your details to get started.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-10">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-4">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                value={profileData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className=' w-[340px]'
              />
            </div>
            <div className="flex-1 space-y-4">
              <Label htmlFor="country">Country</Label>
              <Select value={profileData.country} onValueChange={handleCountryChange} >
                <SelectTrigger className='w-[340px]' id="country">
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent className=' w-[340px]'>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="au">Australia</SelectItem>
                  <SelectItem value="de">Germany</SelectItem>
                  <SelectItem value="fr">France</SelectItem>
                  <SelectItem value="jp">Japan</SelectItem>
                  <SelectItem value="in">India</SelectItem>
                  <SelectItem value="br">Brazil</SelectItem>
                  <SelectItem value="za">South Africa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleNext} className="w-full">
          Next
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ProfileForm

