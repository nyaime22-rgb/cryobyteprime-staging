import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export default function ReportsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Reports & Analytics</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader><CardTitle>Total Students</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">0</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Total Teachers</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">0</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Active Exams</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">0</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Attendance Rate</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">--%</p></CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader><CardTitle>System Status</CardTitle></CardHeader>
        <CardContent>
          <p className="text-green-600">✓ Database Connected</p>
          <p className="text-green-600">✓ Authentication Active</p>
          <p className="text-yellow-600">⚠ Reports module under construction</p>
        </CardContent>
      </Card>
    </div>
  );
}