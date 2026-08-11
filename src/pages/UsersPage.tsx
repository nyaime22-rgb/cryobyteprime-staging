import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

type UserRole = 'admin' | 'teacher' | 'student';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  student_id?: string | null;
  teacher_id?: string | null;
  created_at: string;
  [key: string]: any;
}

export default function UsersPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form state
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('student');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchUsers();
  }, [user, navigate]);

  async function fetchUsers() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      alert('Failed to load users. Check console for details.');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    
    if (!newEmail || !newPassword || !newFullName) {
      alert('Please fill in all fields');
      return;
    }

    setIsCreating(true);

    try {
      // Call the secure database function instead of admin API
      const { data, error } = await supabase.rpc('create_user_with_role', {
        p_email: newEmail,
        p_password: newPassword,
        p_full_name: newFullName,
        p_role: newRole
      });

      if (error) throw error;

      alert('User created successfully!');
      setShowAddModal(false);
      
      // Reset form
      setNewEmail('');
      setNewPassword('');
      setNewFullName('');
      setNewRole('student');
      
      // Refresh list
      fetchUsers();
    } catch (err: any) {
      console.error('Creation error:', err);
      alert(`Error creating user: ${err.message || 'Unknown error'}`);
    } finally {
      setIsCreating(false);
    }
  }

  if (loading) return <div className="p-8">Loading users...</div>;

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Button onClick={() => setShowAddModal(true)}>
          + Add New User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="p-3">Full Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">ID</th>
                  <th className="p-3">Created</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{u.full_name}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        u.role === 'admin' ? 'bg-red-100 text-red-800' :
                        u.role === 'teacher' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-xs">{u.student_id || u.teacher_id || '-'}</td>
                    <td className="p-3 text-gray-500">{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="text-center py-8 text-gray-500">No users found.</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Create New User</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <Label>Full Name</Label>
                  <Input 
                    value={newFullName} 
                    onChange={(e) => setNewFullName(e.target.value)}
                    placeholder="John Doe"
                    disabled={isCreating}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input 
                    type="email"
                    value={newEmail} 
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="john@example.com"
                    disabled={isCreating}
                  />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input 
                    type="password"
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={isCreating}
                  />
                </div>
                <div>
                  <Label>Role</Label>
                  <select 
                    className="w-full p-2 border rounded bg-white"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    disabled={isCreating}
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowAddModal(false)} 
                    className="flex-1"
                    disabled={isCreating}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1" 
                    disabled={isCreating}
                  >
                    {isCreating ? 'Creating...' : 'Create User'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}