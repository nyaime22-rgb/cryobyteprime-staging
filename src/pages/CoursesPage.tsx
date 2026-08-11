import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';

interface Subject {
  id: string;
  name: string;
  code: string;
  description: string | null;
}

export default function CoursesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchSubjects();
  }, [user, navigate]);

  async function fetchSubjects() {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setSubjects(data || []);
    } catch (err) {
      console.error('Error fetching subjects:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="p-8">Loading courses...</div>;

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Course Management</h1>
        <Button disabled title="Coming soon in next update">
          + Add Course
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map((subject) => (
          <Card key={subject.id}>
            <CardHeader>
              <CardTitle>{subject.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-2">Code: {subject.code}</p>
              <p className="text-sm text-gray-600">{subject.description || 'No description'}</p>
            </CardContent>
          </Card>
        ))}
        {subjects.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No courses found. Add your first course via SQL or future UI.
          </div>
        )}
      </div>
    </div>
  );
}