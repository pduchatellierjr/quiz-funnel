'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import QuizForm from '@/components/QuizForm';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/submit-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit quiz');
      }

      const result = await response.json();
      router.push(`/results/${result.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="max-w-md bg-red-900 border border-red-700 rounded p-6">
          <p className="text-white mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-6 py-3 bg-yellow-500 text-black font-semibold rounded hover:bg-yellow-400"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return <QuizForm onSubmit={handleSubmit} isLoading={isLoading} />;
}
