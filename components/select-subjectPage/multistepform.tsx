'use client';
import { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import ProfileForm from './profileForm';
import SubjectsForm from './subjectForms';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
const subjectsList = ['JavaScript',
  'Python',
  'Java',
  'C++',
  'Ruby',
  'Go',
  'TypeScript',
  'PHP',
  'C#',
  'Swift',
  'Rust',
  'Kotlin',];

const MultiStepsForm = () => {
  const [step, setStep] = useState(1);
  const [profileData, setProfileData] = useState({
    fullName: '',
    country: '',
  });
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const router=useRouter()

  useEffect(() => {
    // Retrieve session token when component mounts
    const fetchSession = async () => {
      const session = await getSession();
      if(!session?.token){
        toast.error('Please login to continue');
        return;
      }
      if (session) {
        setToken(session?.token); // Store the token in the state
      }
    };
    fetchSession();
  }, []);

  // Move to the next step
  const nextStep = () => setStep((prev) => prev + 1);

  // Move to the previous step
  const prevStep = () => setStep((prev) => prev - 1);

  // Final submission
  const handleSubmit = async () => {
    if (!token) {
    toast.error('No authentication token found');
      return;
    }

    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include token in the authorization header
        },
        body: JSON.stringify({
          ...profileData,
          subjects: selectedSubjects,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Profile and subjects successfully created!');
        router.push('/');
      } else {
        toast.error(data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Error submitting the form');
    }
  };

  return (
    <div className="py-12 max-w-6xl flex justify-center h-auto">
      {step === 1 && (
        <ProfileForm
          profileData={profileData}
          setProfileData={setProfileData}
          nextStep={nextStep}
        />
      )}

      {step === 2 && (
        <SubjectsForm
          subjectsList={subjectsList}
          selectedSubjects={selectedSubjects}
          setSelectedSubjects={setSelectedSubjects}
          prevStep={prevStep}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default MultiStepsForm;
