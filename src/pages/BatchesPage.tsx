import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';

interface ClassGroup {
  id: string;
  name: string;
  academic_year: string;
  teacher_id: string;
}

export default function BatchesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [classes, setClasses] = useState<ClassGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchClasses();
  }, [user, navigate]);

  async function fetchClasses() {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('*, users(full_name)')
        .order('name');
      
      if (error) throw error;
      setClasses(data || []);
    } catch (err) {
      console.error('Error fetching classes:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="p-8">Loading batches...</div>;

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Batch Scheduling</h1>
        <Button disabled title="Coming soon in next update">
          + Create Batch
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((cls) => (
          <Card key={cls.id}>
            <CardHeader>
              <CardTitle>{cls.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-2">Year: {cls.academic_year}</p>
              <p className="text-sm text-gray-600">
                Teacher: {(cls as any).users?.full_name || 'Unassigned'}
              </p>
            </CardContent>
          </Card>
        ))}
        {classes.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No batches found. Create your first batch via SQL or future UI.
          </div>
        )}
      </div>
    </div>
  );
}