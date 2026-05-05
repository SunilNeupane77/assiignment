import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AnalyticsDashboard } from '../features/analytics/AnalyticsDashboard';
import { responseApi, surveyApi } from '../services/api';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import type { Analytics, Survey } from '../types';

export function AnalyticsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadSurveys = async () => {
      try {
        const response = await surveyApi.getSurveys();
        setSurveys(response.data.data.data || response.data.data || response.data);
      } catch (err) {
        console.error('Failed to load surveys:', err);
        setError('Failed to load surveys');
      } finally {
        setLoading(false);
      }
    };

    const loadData = async (surveyId: string) => {
      try {
        const [analyticsRes, surveyRes] = await Promise.all([
          responseApi.getAnalytics(surveyId),
          surveyApi.getSurvey(surveyId)
        ]);
        console.log('Analytics response:', analyticsRes.data);
        console.log('Survey response:', surveyRes.data);
        setAnalytics(analyticsRes.data.data);
        setSurvey(surveyRes.data.data || surveyRes.data);
      } catch (err) {
        console.error('Failed to load analytics:', err);
        setError('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadData(id);
    } else {
      loadSurveys();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!id) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-gray-600">Select a survey to view analytics</p>
        
        {surveys.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No surveys available</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {surveys.map((survey) => {
              const surveyId = survey._id || survey.id;
              return (
                <Link key={surveyId} to={`/dashboard/analytics/${surveyId}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        {survey.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500 line-clamp-2">{survey.description}</p>
                      <p className="text-sm text-gray-400 mt-2">{survey.questions.length} questions</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/dashboard/analytics')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">{survey?.title || 'Analytics'}</h1>
      </div>

      {error ? (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="py-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      ) : analytics ? (
        <AnalyticsDashboard analytics={analytics} survey={survey} />
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No data available</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
