import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SurveyForm } from '../features/response/SurveyForm';
import { surveyApi, responseApi } from '../services/api';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { getRespondentId } from '../utils/respondent';
import type { Survey } from '../types';

export function SurveyPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const loadSurvey = async (surveyId: string) => {
      try {
        const response = await surveyApi.getSurvey(surveyId);
        setSurvey(response.data.data || response.data);
      } catch (error) {
        console.error('Failed to load survey:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadSurvey(id);
    }
  }, [id]);

  const handleSubmit = async (answers: Record<string, string | number | string[]>) => {
    if (!id) return;

    try {
      const respondentId = getRespondentId();
      const formattedAnswers = Object.entries(answers).map(([questionId, value]) => ({
        questionId,
        value,
      }));

      await responseApi.submitResponse({
        surveyId: id,
        respondentId,
        answers: formattedAnswers,
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to submit response:', err);
      alert('Failed to submit response. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading survey...</div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Survey not found</h2>
          <Button onClick={() => navigate('/dashboard/surveys')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Surveys
          </Button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h2 className="text-2xl font-bold">Thank you!</h2>
          <p className="text-gray-600">Your response has been submitted successfully.</p>
          <Button onClick={() => navigate('/dashboard/surveys')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Surveys
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto mb-6">
        <Button variant="ghost" onClick={() => navigate('/dashboard/surveys')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Surveys
        </Button>
      </div>
      <SurveyForm survey={survey} onSubmit={handleSubmit} />
    </div>
  );
}
