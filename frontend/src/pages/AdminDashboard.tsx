import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { FileText, BarChart3, Plus } from 'lucide-react';
import { surveyApi } from '../services/api';

export function AdminDashboard() {
  const [stats, setStats] = useState({ totalSurveys: 0, totalResponses: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const response = await surveyApi.getDashboardStats();
        setStats(response.data.data);
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
    
    const handleFocus = () => loadStats();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link to="/dashboard/surveys/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Survey
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="flex flex-col h-full">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Surveys
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <p className="text-3xl font-bold">{loading ? '...' : stats.totalSurveys}</p>
            <p className="text-sm text-gray-500 mt-2">Total surveys created</p>
            <Link to="/dashboard/surveys" className="mt-auto pt-4">
              <Button variant="outline" className="w-full">
                View All Surveys
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="flex flex-col h-full">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Responses
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <p className="text-3xl font-bold">{loading ? '...' : stats.totalResponses}</p>
            <p className="text-sm text-gray-500 mt-2">Total responses received</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
