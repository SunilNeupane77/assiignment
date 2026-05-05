import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-2xl">
          <h2 className="text-4xl font-bold mb-4">Create Surveys, Collect Responses</h2>
          <p className="text-gray-600 mb-8">
            Build surveys, gather insights, and analyze responses.
          </p>
          <Link to="/login">
            <Button size="lg">Get Started</Button>
          </Link>
        </div>
      </main>

      <footer className="px-6 py-4 border-t text-center text-sm text-gray-500">
        &copy; 2026 Survey App
      </footer>
    </div>
  );
}
