import { useNavigate } from 'react-router-dom';
import { SurveyBuilder } from '../features/survey/SurveyBuilder';
import { useSurveyBuilder } from '../store/surveyBuilder';
import { Button } from '../components/ui/button';
import { surveyApi } from '../services/api';
import { ArrowLeft } from 'lucide-react';

export function CreateSurveyPage() {
  const navigate = useNavigate();
  const { title, description, questions, reset } = useSurveyBuilder();

  const handleSave = async () => {
    if (!title || questions.length === 0) {
      alert('Please add a title and at least one question');
      return;
    }

    try {
      const formattedQuestions = questions.map((q, index) => ({
        id: q.id,
        type: q.type,
        question: q.question,
        required: q.required,
        order: index,
        ...(q.options && { options: q.options }),
        ...(q.conditionalLogic && { conditionalLogic: q.conditionalLogic }),
      }));

      await surveyApi.createSurvey({
        title,
        description,
        questions: formattedQuestions,
      });
      reset();
      navigate('/dashboard/surveys');
    } catch (err) {
      console.error('Failed to create survey:', err);
      alert('Failed to create survey. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/surveys')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Create Survey</h1>
        </div>
        <Button onClick={handleSave}>Save Survey</Button>
      </div>

      <SurveyBuilder />
    </div>
  );
}
