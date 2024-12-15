'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, Plus } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { generateQuestion } from '@/utils/openAi-client/generateQuestions';
import { toast } from 'sonner';

interface Question {
  id: number;
  text: string | null;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const initialQuestions: Question[] = [
  {
    id: 1,
    text: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
    explanation: "Paris is the capital and most populous city of France.",
  },
  {
    id: 2,
    text: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
    explanation: "Mars is often called the Red Planet due to its reddish appearance in the night sky, caused by iron oxide (rust) on its surface.",
  },
  {
    id: 3,
    text: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    correctAnswer: 2,
    explanation: "The Mona Lisa was painted by Italian Renaissance artist Leonardo da Vinci. It is one of the world's most famous paintings.",
  },
];

export default function MCQQuizList() {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number | null }>({});
  const [showExplanations, setShowExplanations] = useState<{ [key: number]: boolean }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answerIndex }));
    setShowExplanations((prev) => ({ ...prev, [questionId]: true }));
  };

  const addNewQuestion = async () => {
    setIsLoading(true);
    setError(null);
  
    try {
      const newQuestion = await generateQuestion('JavaScript'); // Assuming the API returns a structure like { questionText, options, correctAnswer, explanation }
      const questionData: Question = {
        id: questions.length + 1,
        text: newQuestion.questionText || "New Question",
        options: newQuestion.options || ["Option 1", "Option 2", "Option 3", "Option 4"],
        correctAnswer: parseInt(newQuestion.correctAnswer, 10) ?? 0, // Convert correctAnswer to a number if it's a string
        explanation: newQuestion.explanation || "Explanation for this question.",
      };
  
      setQuestions((prevQuestions) => [...prevQuestions, questionData]);
    } catch (err:any) {
      console.error("Error generating question:", err);
     toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <Card className="w-full max-w-3xl shadow-none border-none">
      <CardHeader>
        <CardTitle>Multiple Choice Quiz</CardTitle>
        <CardDescription>Answer the questions in any order</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[60vh] pr-4">
          {questions.map((question) => (
            <Card key={question.id} className="mb-4">
              <CardHeader>
                <CardTitle className="text-lg">Question {question.id}</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="text-md font-semibold mb-2">{question.text}</h3>
                <RadioGroup
                  value={selectedAnswers[question.id]?.toString()}
                  onValueChange={(value) => handleAnswerSelect(question.id, parseInt(value))}
                >
                  {question.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem
                        value={index.toString()}
                        id={`question-${question.id}-option-${index}`}
                        disabled={showExplanations[question.id]}
                      />
                      <Label htmlFor={`question-${question.id}-option-${index}`} className="flex-grow">
                        {option}
                        {showExplanations[question.id] && index === question.correctAnswer && (
                          <CheckCircle2 className="inline-block ml-2 text-green-500" />
                        )}
                        {showExplanations[question.id] && selectedAnswers[question.id] === index && index !== question.correctAnswer && (
                          <XCircle className="inline-block ml-2 text-red-500" />
                        )}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {showExplanations[question.id] && (
                  <div className="mt-2 p-2 bg-gray-100 rounded-md">
                    <p className="font-semibold">Explanation:</p>
                    <p>{question.explanation}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <Button onClick={addNewQuestion} className="w-full" disabled={isLoading}>
          {isLoading ? "Adding..." : <><Plus className="mr-2 h-4 w-4" /> Add New Question</>}
        </Button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </CardFooter>
    </Card>
  );
}
