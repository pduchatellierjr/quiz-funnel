import { NextRequest, NextResponse } from 'next/server';
import { calculateArchetype, assignPackage } from '@/lib/quiz-logic';
import { insertQuizResponse } from '@/lib/db';
import type { PrimaryFear, PlanningStage } from '@/types/quiz';

// Validation function for email
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validation function for quiz response
interface ValidateQuizResponseInput {
  email?: unknown;
  name?: unknown;
  weddingDate?: unknown;
  primaryFear?: unknown;
  planningStage?: unknown;
  stylePreference?: unknown;
}

interface ValidationError {
  field: string;
  message: string;
}

function validateQuizResponse(body: ValidateQuizResponseInput): { valid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  // Validate email
  if (!body.email || typeof body.email !== 'string') {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!validateEmail(body.email)) {
    errors.push({ field: 'email', message: 'Invalid email format' });
  }

  // Validate name
  if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Name is required' });
  }

  // Validate primaryFear
  if (!body.primaryFear || typeof body.primaryFear !== 'string') {
    errors.push({ field: 'primaryFear', message: 'Primary fear is required' });
  }

  // Validate planningStage
  if (!body.planningStage || typeof body.planningStage !== 'string') {
    errors.push({ field: 'planningStage', message: 'Planning stage is required' });
  }

  // Validate stylePreference
  if (typeof body.stylePreference !== 'number' || body.stylePreference < 0 || body.stylePreference > 100) {
    errors.push({ field: 'stylePreference', message: 'Style preference must be a number between 0 and 100' });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validation = validateQuizResponse(body);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          errors: validation.errors,
        },
        { status: 400 }
      );
    }

    // Type assertion after validation
    const email = body.email as string;
    const name = body.name as string;
    const weddingDate = body.weddingDate as string | undefined;
    const primaryFear = body.primaryFear as PrimaryFear;
    const planningStage = body.planningStage as PlanningStage;
    const stylePreference = body.stylePreference as number;

    // Calculate archetype and package
    const archetype = calculateArchetype(primaryFear, stylePreference);
    const recommendedPackage = assignPackage(stylePreference, planningStage);

    // Insert into database
    const response = await insertQuizResponse({
      email,
      name,
      weddingDate,
      primaryFear,
      planningStage,
      stylePreference,
      archetype,
      recommendedPackage,
    });

    const responseId = response.id as string;

    // Trigger Zapier webhook (fire-and-forget)
    const zapierUrl = process.env.NEXT_PUBLIC_ZAPIER_WEBHOOK_URL;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (zapierUrl && baseUrl) {
      fetch(zapierUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          archetype,
          package: recommendedPackage,
          resultsLink: `${baseUrl}/results/${responseId}`,
        }),
      }).catch((error) => {
        console.error('Zapier webhook error:', error);
      });
    }

    // Return success response
    return NextResponse.json(
      {
        success: true,
        id: responseId,
        archetype,
        recommendedPackage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while processing your quiz response',
      },
      { status: 500 }
    );
  }
}
