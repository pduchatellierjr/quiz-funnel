import { getQuizResponse } from '@/lib/db';
import ResultsPage from '@/components/ResultsPage';
import { notFound } from 'next/navigation';
import type { ResultsData } from '@/types/quiz';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Results({ params }: PageProps) {
  try {
    const { id } = await params;
    const data = await getQuizResponse(id);

    if (!data) {
      notFound();
    }

    // Transform database response to ResultsData
    const profile: ResultsData = {
      id: data.id,
      email: data.email,
      name: data.name,
      weddingDate: data.wedding_date,
      primaryFear: data.primary_fear,
      planningStage: data.planning_stage,
      stylePreference: data.style_preference,
      archetype: data.archetype,
      recommendedPackage: data.recommended_package,
      createdAt: data.created_at,
      completedAt: data.completed_at,
    };

    return <ResultsPage profile={profile} />;
  } catch (error) {
    console.error('Error loading results:', error);
    notFound();
  }
}
