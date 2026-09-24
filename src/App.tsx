import { usePathPilotStore } from './store/pathpilotStore';
import { RoleSelection } from './pages/RoleSelection';
import { LearnerDashboard } from './pages/learner/LearnerDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';

export default function App() {
  const role = usePathPilotStore(s => s.activeRole);
  if (role === 'LEARNER') return <LearnerDashboard />;
  if (role === 'ADMIN') return <AdminDashboard />;
  return <RoleSelection />;
}
