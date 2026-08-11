import { useAuth } from '@/context/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Calendar, Users, FileText } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()

  const getRoleSpecificContent = () => {
    switch (user?.role) {
      case 'admin':
        return {
          title: 'Admin Dashboard',
          description: 'Manage users, courses, batches, and system settings.',
          features: [
            { icon: Users, label: 'User Management', desc: 'Manage students, teachers, and staff' },
            { icon: BookOpen, label: 'Course Management', desc: 'Configure courses and subjects' },
            { icon: Calendar, label: 'Batch Scheduling', desc: 'Manage academic batches' },
            { icon: FileText, label: 'Reports & Analytics', desc: 'View system-wide reports' },
          ]
        }
      case 'teacher':
        return {
          title: 'Teacher Dashboard',
          description: 'Manage your classes, attendance, and assessments.',
          features: [
            { icon: Calendar, label: 'Take Attendance', desc: 'Mark student attendance' },
            { icon: FileText, label: 'Create Assessments', desc: 'Build question banks and tests' },
            { icon: Users, label: 'Student List', desc: 'View enrolled students' },
            { icon: BookOpen, label: 'My Subjects', desc: 'Manage assigned subjects' },
          ]
        }
      case 'student':
        return {
          title: 'Student Dashboard',
          description: 'View your attendance, take assessments, and track progress.',
          features: [
            { icon: Calendar, label: 'My Attendance', desc: 'View attendance history' },
            { icon: FileText, label: 'Assessments', desc: 'Take upcoming tests' },
            { icon: BookOpen, label: 'My Courses', desc: 'View enrolled subjects' },
            { icon: Users, label: 'Results', desc: 'Check grades and performance' },
          ]
        }
      default:
        return {
          title: 'Dashboard',
          description: 'Welcome to CryoBytePrime CBT & Attendance System.',
          features: []
        }
    }
  }

  const content = getRoleSpecificContent()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{content.title}</h1>
        <p className="text-muted-foreground mt-1">{content.description}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {content.features.map((feature, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {feature.label}
              </CardTitle>
              <feature.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                {feature.desc}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks for {user?.role === 'admin' ? 'administrators' : user?.role === 'teacher' ? 'teachers' : 'students'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            More functionality coming soon. This dashboard will be expanded with role-specific widgets and quick actions.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
