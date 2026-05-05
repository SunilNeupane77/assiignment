import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { Analytics, Survey } from '../../types';

interface AnalyticsDashboardProps {
  analytics: Analytics;
  survey: Survey | null;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export function AnalyticsDashboard({ analytics, survey }: AnalyticsDashboardProps) {
  console.log('AnalyticsDashboard received:', { analytics, survey });
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Survey Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Responses:</span>
            <span className="text-2xl font-bold">{analytics.totalResponses}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Questions:</span>
            <span className="font-semibold">{survey?.questions.length || analytics.questions.length}</span>
          </div>
        </CardContent>
      </Card>

      {analytics.totalResponses === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 text-lg mb-2">No responses yet</p>
            <p className="text-gray-400 text-sm">Share your survey to start collecting responses</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {analytics.questions.map((question) => (
            <Card key={question.questionId}>
              <CardHeader>
                <CardTitle className="text-lg">{question.question}</CardTitle>
                <p className="text-sm text-gray-500">Type: {question.type}</p>
              </CardHeader>
              <CardContent>
                {(question.type === 'radio' || question.type === 'checkbox') && question.counts && (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={Object.entries(question.counts).map(([option, count]) => ({ option, count }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="option" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count">
                        {Object.entries(question.counts).map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}

                {question.type === 'rating' && question.average !== undefined && (
                  <div>
                    <p className="text-center text-3xl font-bold mb-4">{question.average.toFixed(2)}</p>
                    <p className="text-center text-gray-600">Average Rating (from {question.count} responses)</p>
                  </div>
                )}

                {question.type === 'text' && question.responses && (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {question.responses.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No responses yet</p>
                    ) : (
                      question.responses.map((response: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-sm p-2">
                          {response}
                        </Badge>
                      ))
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
