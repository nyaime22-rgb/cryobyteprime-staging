import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  if (!user) {
    navigate('/login');
    return null;
  }

  const menuItems = [
    { title: 'User Management', desc: 'Manage students, teachers, and staff', path: '/users' },
    { title: 'Course Management', desc: 'Configure courses and subjects', path: '/courses' },
    { title: 'Batch Scheduling', desc: 'Manage academic batches', path: '/batches' },
    { title: 'Reports & Analytics', desc: 'View system-wide reports', path: '/reports' },
    { title: 'Question Bank', desc: 'Create and manage question bank', path: '/questions' },
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user.user_metadata?.full_name || user.email}</p>
        </div>
        <Button variant="outline" onClick={() => signOut()}>Sign Out</Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {menuItems.map((item) => (
          <Card 
            key={item.title} 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(item.path)}
          >
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{item.desc}</p>
              <Button 
                className="mt-4" 
                variant="secondary" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent double firing
                  navigate(item.path);
                }}
              >
                Manage →
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <Button variant="outline" onClick={() => navigate('/users')}>+ Add User</Button>
            <Button variant="outline" onClick={() => navigate('/courses')}>+ Add Course</Button>
            <Button variant="outline" onClick={() => navigate('/batches')}>+ Create Batch</Button>
              <Button variant="outline" onClick={() => navigate('/questions')}>+ Question Bank</Button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            More functionality coming soon. This dashboard will be expanded with role-specific widgets and quick actions.
          </p>
        </CardContent>
      </Card>

      <footer className="text-center text-sm text-gray-500 pt-8 border-t">
        © 2026 CryoBytePrime. All rights reserved.
      </footer>
    </div>
  );
}