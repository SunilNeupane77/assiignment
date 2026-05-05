import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';

export function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <header className="px-6 py-4 flex justify-between items-center border-b bg-white">
      <Link to="/">
        <h1 className="text-xl font-bold">Survey App</h1>
      </Link>
      <div className="flex items-center gap-4">
        {token ? (
          <>
            <span className="text-sm text-gray-600">{user.username}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <Link to="/login">
            <Button variant="outline">Login</Button>
          </Link>
        )}
      </div>
    </header>
  );
}
