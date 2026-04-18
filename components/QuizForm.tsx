'use client';

import { useState } from 'react';
import { UNIVERSAL_QUESTIONS, ADAPTIVE_QUESTIONS } from '@/lib/constants';
import { getAdaptiveQuestions } from '@/lib/quiz-logic';
import type { PrimaryFear, PlanningStage } from '@/types/quiz';

interface QuizFormProps {
  onSubmit: (data: {
    email: string;
    name: string;
    weddingDate?: string;
    primaryFear: PrimaryFear;
    planningStage: PlanningStage;
    stylePreference: number;
    adaptiveAnswers: Record<string, string>;
  }) => Promise<void>;
  isLoading?: boolean;
}

export default function QuizForm({ onSubmit, isLoading = false }: QuizFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<{
    primaryFear?: PrimaryFear;
    planningStage?: PlanningStage;
    stylePreference?: number;
  }>({ stylePreference: 50 });
  const [adaptiveAnswers, setAdaptiveAnswers] = useState<Record<string, string>>({});
  const [personalInfo, setPersonalInfo] = useState({
    email: '',
    name: '',
    weddingDate: '',
  });

  // Calculate adaptive question IDs based on current answers
  const adaptiveQuestionIds = answers.primaryFear && answers.planningStage
    ? getAdaptiveQuestions(answers.primaryFear, answers.planningStage)
    : [];

  const totalSteps = UNIVERSAL_QUESTIONS.length + adaptiveQuestionIds.length + 1;

  // Determine step type
  const isUniversalStep = currentStep < UNIVERSAL_QUESTIONS.length;
  const isAdaptiveStep = currentStep >= UNIVERSAL_QUESTIONS.length &&
    currentStep < UNIVERSAL_QUESTIONS.length + adaptiveQuestionIds.length;
  const isPersonalInfoStep = currentStep === totalSteps - 1;

  // Get current question
  const getCurrentQuestion = () => {
    if (isUniversalStep) {
      return UNIVERSAL_QUESTIONS[currentStep];
    }
    if (isAdaptiveStep) {
      const adaptiveIndex = currentStep - UNIVERSAL_QUESTIONS.length;
      const questionId = adaptiveQuestionIds[adaptiveIndex];
      return ADAPTIVE_QUESTIONS[questionId as keyof typeof ADAPTIVE_QUESTIONS];
    }
    return null;
  };

  const currentQuestion = getCurrentQuestion();

  // Check if current field is answered
  const isCurrentAnswerProvided = () => {
    if (isUniversalStep && currentQuestion) {
      const questionId = currentQuestion.id;
      if (questionId === 'primary-fear') return !!answers.primaryFear;
      if (questionId === 'planning-stage') return !!answers.planningStage;
      if (questionId === 'style-preference') return answers.stylePreference !== undefined;
    }
    if (isAdaptiveStep && currentQuestion) {
      return !!adaptiveAnswers[currentQuestion.id];
    }
    if (isPersonalInfoStep) {
      return !!personalInfo.email && !!personalInfo.name;
    }
    return false;
  };

  const handleAnswer = (questionId: string, value: unknown) => {
    if (isUniversalStep) {
      if (questionId === 'primary-fear') {
        setAnswers(prev => ({ ...prev, primaryFear: value as PrimaryFear }));
      } else if (questionId === 'planning-stage') {
        setAnswers(prev => ({ ...prev, planningStage: value as PlanningStage }));
      } else if (questionId === 'style-preference') {
        setAnswers(prev => ({ ...prev, stylePreference: value as number }));
      }
    } else if (isAdaptiveStep) {
      setAdaptiveAnswers(prev => ({ ...prev, [questionId]: String(value) }));
    }
  };

  const handlePersonalInfoChange = (field: 'email' | 'name' | 'weddingDate', value: string) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (isCurrentAnswerProvided()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const handleSubmit = async () => {
    if (!personalInfo.email || !personalInfo.name) return;
    if (!answers.primaryFear || !answers.planningStage || answers.stylePreference === undefined) return;

    try {
      await onSubmit({
        email: personalInfo.email,
        name: personalInfo.name,
        weddingDate: personalInfo.weddingDate || undefined,
        primaryFear: answers.primaryFear,
        planningStage: answers.planningStage,
        stylePreference: answers.stylePreference,
        adaptiveAnswers,
      });
    } catch (error) {
      console.error('Quiz submission error:', error);
    }
  };

  const progressPercent = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-semibold text-gray-400">
              Question {currentStep + 1} of {totalSteps}
            </h2>
            <span className="text-xs text-gray-500">{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Question Container */}
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-8 mb-8">
          {isUniversalStep && currentQuestion && (
            <div>
              <h2 className="text-2xl font-bold mb-6">{currentQuestion.question}</h2>

              {currentQuestion.type === 'multiple-choice' && (
                <div className="space-y-3">
                  {currentQuestion.options?.map(option => (
                    <button
                      key={option.id}
                      onClick={() => handleAnswer('primary-fear', option.id)}
                      className={`w-full text-left p-4 border rounded-lg transition-all ${
                        answers.primaryFear === option.id
                          ? 'border-yellow-500 bg-yellow-500 bg-opacity-10'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'radio' && (
                <div className="space-y-3">
                  {currentQuestion.options?.map(option => (
                    <button
                      key={option.id}
                      onClick={() => handleAnswer('planning-stage', option.id)}
                      className={`w-full text-left p-4 border rounded-lg transition-all ${
                        answers.planningStage === option.id
                          ? 'border-yellow-500 bg-yellow-500 bg-opacity-10'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'slider' && (
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-400 mb-6">
                    <span>{currentQuestion.leftLabel}</span>
                    <span>{currentQuestion.rightLabel}</span>
                  </div>
                  <input
                    type="range"
                    min={currentQuestion.min}
                    max={currentQuestion.max}
                    value={answers.stylePreference ?? 50}
                    onChange={e => handleAnswer('style-preference', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                  />
                  <div className="text-center text-xl font-semibold text-yellow-500">
                    {answers.stylePreference ?? 50}
                  </div>
                </div>
              )}
            </div>
          )}

          {isAdaptiveStep && currentQuestion && (
            <div>
              <h2 className="text-2xl font-bold mb-6">{currentQuestion.question}</h2>

              {currentQuestion.type === 'open-text' && (
                <textarea
                  value={adaptiveAnswers[currentQuestion.id] ?? ''}
                  onChange={e => handleAnswer(currentQuestion.id, e.target.value)}
                  placeholder={currentQuestion.placeholder}
                  className="w-full p-4 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none min-h-32"
                />
              )}

              {currentQuestion.type === 'radio' && (
                <div className="space-y-3">
                  {currentQuestion.options?.map(option => (
                    <button
                      key={option.id}
                      onClick={() => handleAnswer(currentQuestion.id, option.id)}
                      className={`w-full text-left p-4 border rounded-lg transition-all ${
                        adaptiveAnswers[currentQuestion.id] === option.id
                          ? 'border-yellow-500 bg-yellow-500 bg-opacity-10'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {isPersonalInfoStep && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Tell us about yourself</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={personalInfo.name}
                    onChange={e => handlePersonalInfoChange('name', e.target.value)}
                    placeholder="Your name"
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={personalInfo.email}
                    onChange={e => handlePersonalInfoChange('email', e.target.value)}
                    placeholder="your@email.com"
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Wedding Date (optional)
                  </label>
                  <input
                    type="date"
                    value={personalInfo.weddingDate}
                    onChange={e => handlePersonalInfoChange('weddingDate', e.target.value)}
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 justify-between">
          {currentStep > 0 && (
            <button
              onClick={handleBack}
              className="px-6 py-2 border border-gray-700 text-white rounded-lg hover:border-gray-600 hover:bg-gray-900 transition-all"
            >
              Back
            </button>
          )}
          <div className="flex-1" />
          {!isPersonalInfoStep ? (
            <button
              onClick={handleNext}
              disabled={!isCurrentAnswerProvided() || isLoading}
              className="px-6 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!isCurrentAnswerProvided() || isLoading}
              className="px-6 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? 'Submitting...' : 'Get My Results'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
