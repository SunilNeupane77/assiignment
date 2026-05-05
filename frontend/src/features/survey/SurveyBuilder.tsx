import { useState } from 'react';
import { useSurveyBuilder } from '../../store/surveyBuilder';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Checkbox } from '../../components/ui/checkbox';
import { Plus, Trash2, GripVertical, ArrowUp, ArrowDown } from 'lucide-react';
import type { Question } from '../../types';

export function SurveyBuilder() {
  const { title, description, questions, setTitle, setDescription, addQuestion, deleteQuestion, reorderQuestion } = useSurveyBuilder();
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [questionType, setQuestionType] = useState('text');

  const handleAddQuestion = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const conditionalLogic = formData.get('conditionalDependsOn') && formData.get('conditionalValue')
      ? {
          dependsOn: formData.get('conditionalDependsOn') as string,
          value: formData.get('conditionalValue') as string,
        }
      : undefined;

    const newQuestion: Question = {
      id: Date.now().toString(),
      type: formData.get('type') as 'text' | 'radio' | 'checkbox' | 'rating',
      question: formData.get('question') as string,
      required: formData.get('required') === 'on',
      options: formData.get('options') 
        ? (formData.get('options') as string).split(',').map(o => o.trim()).filter(Boolean)
        : undefined,
      conditionalLogic,
    };

    addQuestion(newQuestion);
    setShowQuestionForm(false);
    e.currentTarget.reset();
    setQuestionType('text');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Survey Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Survey Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter survey title"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter survey description"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Questions</h2>
        <Button onClick={() => setShowQuestionForm(!showQuestionForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      </div>

      {showQuestionForm && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleAddQuestion} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="question">Question</Label>
                <Input
                  id="question"
                  name="question"
                  required
                  placeholder="Enter your question"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Question Type</Label>
                <Select name="type" value={questionType} onValueChange={setQuestionType}>
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text Input</SelectItem>
                    <SelectItem value="radio">Multiple Choice (Single Select)</SelectItem>
                    <SelectItem value="checkbox">Checkbox (Multi-select)</SelectItem>
                    <SelectItem value="rating">Rating (1-5)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(questionType === 'radio' || questionType === 'checkbox') && (
                <div className="space-y-2">
                  <Label htmlFor="options">Options (comma-separated)</Label>
                  <Input
                    id="options"
                    name="options"
                    placeholder="Option 1, Option 2, Option 3"
                    required
                  />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="required"
                  name="required"
                />
                <Label htmlFor="required">Required</Label>
              </div>

              {questions.length > 0 && (
                <div className="border-t pt-4 space-y-3 mt-4">
                  <h4 className="font-medium text-sm">Conditional Logic (Optional)</h4>
                  <div className="space-y-2">
                    <Label htmlFor="conditionalDependsOn">Show only if</Label>
                    <Select name="conditionalDependsOn">
                      <SelectTrigger id="conditionalDependsOn">
                        <SelectValue placeholder="Select question" />
                      </SelectTrigger>
                      <SelectContent>
                        {questions.map((q) => (
                          <SelectItem key={q.id} value={q.id}>
                            {q.question}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="conditionalValue">Equals</Label>
                    <Input
                      id="conditionalValue"
                      name="conditionalValue"
                      placeholder="Expected value"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button type="submit">Add Question</Button>
                <Button type="button" variant="outline" onClick={() => setShowQuestionForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {questions.map((question, index) => (
          <Card key={question.id}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <GripVertical className="h-5 w-5 text-gray-400 mt-1" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium">
                        {index + 1}. {question.question}
                        {question.required && <span className="text-red-500 ml-1">*</span>}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Type: {question.type}</p>
                      {question.options && (
                        <p className="text-sm text-gray-500">Options: {question.options.join(', ')}</p>
                      )}
                      {question.conditionalLogic && (
                        <p className="text-sm text-blue-600 mt-1">
                          Conditional: Shows if "{questions.find(q => q.id === question.conditionalLogic?.dependsOn)?.question}" = "{question.conditionalLogic.value}"
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => reorderQuestion(index, index - 1)}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => reorderQuestion(index, index + 1)}
                        disabled={index === questions.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteQuestion(question.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
