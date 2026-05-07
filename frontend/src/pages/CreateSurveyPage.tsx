import { useNavigate } from 'react-router-dom';
import { SurveyBuilder } from '../features/survey/SurveyBuilder';
import { useSurveyBuilder } from '../store/surveyBuilder';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { surveyApi } from '../services/api';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export function CreateSurveyPage() {
  const navigate = useNavigate();
  const { title, description, questions, reset } = useSurveyBuilder();
  const [startDate, setStartDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

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
        ...(startDate && { startDate: new Date(startDate) }),
        ...(expiryDate && { expiryDate: new Date(expiryDate) }),
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

      <div className="grid grid-cols-2 gap-4 p-4 bg-card rounded-lg border">
        <div>
          <Label htmlFor="startDate">Start Date (Optional)</Label>
          <Input id="startDate" type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
          <Input id="expiryDate" type="datetime-local" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
        </div>
      </div>

      <SurveyBuilder />
    </div>
  );
}
