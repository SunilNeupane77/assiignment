import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { responseApi } from '../../services/api';
import { getRespondentId } from '../../utils/respondent';
import type { Survey } from '../../types';

interface SurveyFormProps {
  survey: Survey;
  onSubmit: (answers: Record<string, string | number | string[]>) => void;
}

export function SurveyForm({ survey, onSubmit }: SurveyFormProps) {
  const [answers, setAnswers] = useState<Record<string, string | number | string[]>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadPartialResponse = async () => {
      try {
        const respondentId = getRespondentId();
        const surveyId = survey._id || survey.id;
        if (!surveyId) return;
        
        const response = await responseApi.getPartial(surveyId, respondentId);
        if (response.data.data?.answers) {
          const savedAnswers: Record<string, string | number | string[]> = {};
          response.data.data.answers.forEach((a: { questionId: string; value: string | number | string[] }) => {
            savedAnswers[a.questionId] = a.value;
          });
          setAnswers(savedAnswers);
        }
      } catch {
        // No partial response found
      }
    };
    loadPartialResponse();
  }, [survey]);

  useEffect(() => {
    const saveProgress = async () => {
      if (Object.keys(answers).length === 0) return;
      
      setSaving(true);
      try {
        const respondentId = getRespondentId();
        const surveyId = survey._id || survey.id;
        if (!surveyId) return;
        
        const formattedAnswers = Object.entries(answers).map(([questionId, value]) => ({
          questionId,
          value,
        }));

        await responseApi.savePartial({
          surveyId,
          respondentId,
          answers: formattedAnswers,
        });
      } catch (error) {
        console.error('Failed to save progress:', error);
      } finally {
        setSaving(false);
      }
    };

    const interval = setInterval(saveProgress, 30000);
    return () => clearInterval(interval);
  }, [answers, survey]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    survey.questions.forEach((question) => {
      let shouldShow = true;
      if (question.conditionalLogic) {
        const dependsOnAnswer = answers[question.conditionalLogic.dependsOn];
        shouldShow = dependsOnAnswer === question.conditionalLogic.value;
      }

      if (shouldShow && question.required && !answers[question.id]) {
        newErrors[question.id] = 'This field is required';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(answers);
  };

  const handleChange = (questionId: string, value: string | number | string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[questionId];
      return newErrors;
    });
  };

  const manualSaveProgress = async () => {
    if (Object.keys(answers).length === 0) return;
    
    setSaving(true);
    try {
      const respondentId = getRespondentId();
      const surveyId = survey._id || survey.id;
      if (!surveyId) return;
      
      const formattedAnswers = Object.entries(answers).map(([questionId, value]) => ({
        questionId,
        value,
      }));

      await responseApi.savePartial({
        surveyId,
        respondentId,
        answers: formattedAnswers,
      });
    } catch (error) {
      console.error('Failed to save progress:', error);
    } finally {
      setSaving(false);
    }
  };

  const renderQuestion = (question: { id: string; question: string; type: string; required?: boolean; conditionalLogic?: { dependsOn: string; value: string | number | string[] }; options?: string[] }, index: number) => {
    // Check conditional logic
    if (question.conditionalLogic) {
      const dependsOnAnswer = answers[question.conditionalLogic.dependsOn];
      if (dependsOnAnswer !== question.conditionalLogic.value) {
        return null;
      }
    }

    return (
      <div key={question.id} className="space-y-2">
        <Label>
          <span className="font-semibold text-gray-700">{index + 1}. </span>
          {question.question}
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </Label>

        {question.type === 'text' && (
          <Textarea
            value={(answers[question.id] as string) || ''}
            onChange={(e) => handleChange(question.id, e.target.value)}
            placeholder="Your answer"
          />
        )}

        {question.type === 'radio' && (
          <div className="space-y-2">
            {question.options?.map((option: string) => (
              <div key={option} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`${question.id}-${option}`}
                  name={question.id}
                  value={option}
                  checked={answers[question.id] === option}
                  onChange={(e) => handleChange(question.id, e.target.value)}
                  className="h-4 w-4"
                />
                <label htmlFor={`${question.id}-${option}`}>{option}</label>
              </div>
            ))}
          </div>
        )}

        {question.type === 'checkbox' && (
          <div className="space-y-2">
            {question.options?.map((option: string) => (
              <div key={option} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`${question.id}-${option}`}
                  checked={Array.isArray(answers[question.id]) && (answers[question.id] as string[]).includes(option)}
                  onChange={(e) => {
                    const current = (answers[question.id] as string[]) || [];
                    const updated = e.target.checked
                      ? [...current, option]
                      : current.filter((v: string) => v !== option);
                    handleChange(question.id, updated);
                  }}
                  className="h-4 w-4 rounded"
                />
                <label htmlFor={`${question.id}-${option}`}>{option}</label>
              </div>
            ))}
          </div>
        )}

        {question.type === 'rating' && (
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => handleChange(question.id, rating)}
                className={`w-10 h-10 rounded-full border-2 ${
                  answers[question.id] === rating
                    ? 'bg-primary text-white border-primary'
                    : 'border-gray-300 hover:border-primary'
                }`}
              >
                {rating}
              </button>
            ))}
          </div>
        )}

        {errors[question.id] && (
          <p className="text-sm text-red-500">{errors[question.id]}</p>
        )}
      </div>
    );
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{survey.title}</CardTitle>
        <CardDescription>{survey.description}</CardDescription>
        {Object.keys(answers).length > 0 && (
          <p className="text-sm text-green-600 mt-2">
            {saving ? 'Saving...' : 'Progress auto-saved'}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {survey.questions.map((question, index) => renderQuestion(question, index))}
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={manualSaveProgress} disabled={saving}>
              Save Progress
            </Button>
            <Button type="submit" className="flex-1">
              Submit Survey
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
