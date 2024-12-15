export const generateQuestion = async (topic: string) => {
    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate question');
      }
  
      return await response.json(); // Expected format: { questionText, options, correctAnswer, explanation }
    } catch (error) {
      console.error('Error fetching question:', error);
      throw error;
    }
  };
  