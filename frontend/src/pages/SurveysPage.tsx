import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { Plus, Trash2, Eye } from 'lucide-react';
import { surveyApi } from '../services/api';
import type { Survey } from '../types';

export function SurveysPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';

  useEffect(() => {
    const loadSurveys = async () => {
      try {
        const response = await surveyApi.getSurveys();
        setSurveys(response.data.data.data || response.data.data || response.data);
      } catch (error) {
        console.error('Failed to load surveys:', error);
      } finally {
        setLoading(false);
      }
    };
    loadSurveys();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await surveyApi.deleteSurvey(id);
      setSurveys(surveys.filter(s => (s._id || s.id) !== id));
      setOpenDialogId(null); // Close dialog after successful deletion
    } catch (error) {
      console.error('Failed to delete survey:', error);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2 mt-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-8 w-1/3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Surveys</h1>
        {isAdmin && (
          <Link to="/dashboard/surveys/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Survey
            </Button>
          </Link>
        )}
      </div>

      {surveys.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">No surveys yet</p>
            {isAdmin && (
              <Link to="/dashboard/surveys/new">
                <Button>Create Your First Survey</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {surveys.map((survey) => {
            const surveyId = survey._id || survey.id;
            return (
              <Card key={surveyId} className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle className="text-lg">{survey.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    {survey.description}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    {survey.questions.length} questions
                  </p>
                  <div className="flex gap-2 mt-auto">
                    <Link to={`/survey/${surveyId}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </Link>
                    {isAdmin && (
                      <Link to={`/dashboard/analytics/${surveyId}`}>
                        <Button variant="outline" size="sm">
                          Analytics
                        </Button>
                      </Link>
                    )}
                    {isAdmin && (
                      <Dialog open={openDialogId === surveyId} onOpenChange={(isOpen) => setOpenDialogId(isOpen && surveyId ? surveyId : null)}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                            <DialogDescription>
                              This action cannot be undone. This will permanently delete your survey
                              and remove its data from our servers.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setOpenDialogId(null)}>Cancel</Button>
                            <Button variant="destructive" onClick={() => handleDelete(surveyId!)}>Delete</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
