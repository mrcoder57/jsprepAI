'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Code, FileCode, Coffee, Hash, Gem, Terminal } from 'lucide-react'

interface SubjectsFormProps {
  subjectsList: string[]
  selectedSubjects: string[]
  setSelectedSubjects: React.Dispatch<React.SetStateAction<string[]>>
  prevStep: () => void
  handleSubmit: () => void
}

const SubjectsForm: React.FC<SubjectsFormProps> = ({
  subjectsList,
  selectedSubjects,
  setSelectedSubjects,
  prevStep,
  handleSubmit,
}) => {
  const toggleSubject = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject))
    } else {
      setSelectedSubjects([...selectedSubjects, subject])
    }
  }

  const getSubjectIcon = (subject: string) => {
    switch (subject.toLowerCase()) {
      case 'javascript':
        return <Code className="h-6 w-6 text-yellow-400" />
      case 'python':
        return <FileCode className="h-6 w-6 text-blue-500" />
      case 'java':
        return <Coffee className="h-6 w-6 text-red-500" />
      case 'c++':
        return <Hash className="h-6 w-6 text-purple-500" />
      case 'ruby':
        return <Gem className="h-6 w-6 text-red-600" />
      case 'go':
        return <Terminal className="h-6 w-6 text-cyan-500" />
      case 'typescript':
        return <Code className="h-6 w-6 text-blue-600" />
      case 'php':
        return <FileCode className="h-6 w-6 text-indigo-500" />
      case 'c#':
        return <Hash className="h-6 w-6 text-green-600" />
      case 'swift':
        return <Code className="h-6 w-6 text-orange-500" />
      case 'rust':
        return <Terminal className="h-6 w-6 text-orange-600" />
      case 'kotlin':
        return <Coffee className="h-6 w-6 text-purple-600" />
      default:
        return <Code className="h-6 w-6 text-gray-500" />
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto border-none shadow-none">
      <CardHeader>
        <CardTitle className=' text-[26px]'>Select Programming Languages</CardTitle>
        <CardDescription>Choose the languages you're interested in learning or improving.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 justify-center">
          {subjectsList.map((subject) => (
            <div
              key={subject}
              className={`flex flex-col items-center justify-center p-3 rounded-lg cursor-pointer transition-all duration-200 w-28 h-28 ${
                selectedSubjects.includes(subject)
                  ? 'bg-green-50 border-2 border-green-500'
                  : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
              }`}
              onClick={() => toggleSubject(subject)}
            >
              {getSubjectIcon(subject)}
              <span className="mt-2 text-xs font-medium text-center">{subject}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button onClick={handleSubmit} className="w-full">
          Submit
        </Button>
        <Button onClick={prevStep} variant="outline" className="w-full">
          Back
        </Button>
      </CardFooter>
    </Card>
  )
}

export default SubjectsForm

