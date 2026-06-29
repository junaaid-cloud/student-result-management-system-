import React, { useState, useEffect } from 'react';
import { 
  Users, 
  LayoutDashboard, 
  Calculator, 
  FileText, 
  LogOut, 
  UserPlus, 
  GraduationCap,
  TrendingUp,
  CheckCircle,
  XCircle,
  Search,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Student, Result, Marks } from './types';

// Components
const Login = ({ onLogin }: { onLogin: () => void }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.success) {
      onLogin();
    } else {
      setError('Invalid credentials. Use admin / admin123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 p-3 rounded-xl mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Result Management</h1>
          <p className="text-slate-500">Sign in to your admin account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="admin"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <button 
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
          >
            Sign In
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-slate-400">
          Demo: admin / admin123
        </p>
      </motion.div>
    </div>
  );
};

const DashboardHome = ({ stats }: { stats: any }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { label: 'Total Students', value: stats?.totalStudents || 0, icon: Users, color: 'bg-blue-500', shadow: 'shadow-blue-100' },
        { label: 'Passed', value: stats?.passed || 0, icon: CheckCircle, color: 'bg-emerald-500', shadow: 'shadow-emerald-100' },
        { label: 'Failed', value: stats?.failed || 0, icon: XCircle, color: 'bg-rose-500', shadow: 'shadow-rose-100' },
        { label: 'Average GPA', value: stats?.averageGPA || 0, icon: TrendingUp, color: 'bg-amber-500', shadow: 'shadow-amber-100' },
      ].map((item, i) => (
        <motion.div 
          key={item.label}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className={`bg-white p-6 rounded-2xl border border-slate-100 flex items-center space-x-4 shadow-sm ${item.shadow}`}
        >
          <div className={`${item.color} p-3 rounded-xl text-white`}>
            <item.icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">{item.label}</p>
            <p className="text-2xl font-bold text-slate-800">{item.value}</p>
          </div>
        </motion.div>
      ))}
    </div>

    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
        <GraduationCap className="w-5 h-5 text-blue-500" />
        System Statistics & Overview
      </h3>
      <div className="h-64 flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
         <p className="text-slate-400">Graphical summary will appear here once more data is added.</p>
      </div>
    </div>
  </div>
);

const StudentsList = ({ students, onAdd, onEdit, onDelete }: { students: Student[], onAdd: () => void, onEdit: (s: Student) => void, onDelete: (id: string) => void }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
      <h2 className="text-xl font-bold text-slate-800">Students Directory</h2>
      <button 
        onClick={onAdd}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
      >
        <UserPlus className="w-4 h-4" />
        New Student
      </button>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Roll Number</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Department</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {students.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                No students found.
              </td>
            </tr>
          ) : (
            students.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                      {student.name.charAt(0)}
                    </div>
                    <span className="font-medium text-slate-800">{student.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-sm text-slate-600">{student.rollNo}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium">
                    {student.department}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => onEdit(student)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                  <button onClick={() => onDelete(student.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Remove</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

const AddMarks = ({ students, onSave }: { students: Student[], onSave: () => void }) => {
  const [selectedId, setSelectedId] = useState('');
  const [marks, setMarks] = useState<Marks>({ math: 0, science: 0, english: 0, history: 0, computer: 0 });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId) return;
    setLoading(true);
    await fetch(`/api/marks/${selectedId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(marks)
    });
    setLoading(false);
    onSave();
    alert('Marks updated successfully!');
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Calculator className="w-6 h-6 text-blue-500" />
        Record Student Marks
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Select Student</label>
          <select 
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Choose a student...</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.rollNo})</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.keys(marks).map((subject) => (
            <div key={subject}>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{subject}</label>
              <input 
                type="number" 
                max="100"
                min="0"
                value={marks[subject as keyof Marks]}
                onChange={(e) => setMarks({...marks, [subject]: parseInt(e.target.value) || 0})}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          ))}
        </div>

        <button 
          disabled={loading || !selectedId}
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Update & Calculate GPA'}
        </button>
      </form>
    </div>
  );
};

const ResultsTable = ({ results }: { results: Result[] }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
    <div className="p-6 border-b border-slate-100">
      <h2 className="text-xl font-bold text-slate-800">Academic Results</h2>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Math</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Science</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">English</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">History</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Comp.</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">GPA</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Grade</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {results.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                No matching results found.
              </td>
            </tr>
          ) : (
            results.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-800">{r.name}</div>
                  <div className="text-xs text-slate-500">{r.rollNo}</div>
                </td>
                <td className="px-6 py-4 text-center">{r.marks.math}</td>
                <td className="px-6 py-4 text-center">{r.marks.science}</td>
                <td className="px-6 py-4 text-center">{r.marks.english}</td>
                <td className="px-6 py-4 text-center">{r.marks.history}</td>
                <td className="px-6 py-4 text-center">{r.marks.computer}</td>
                <td className="px-6 py-4 text-center">
                  <span className="font-bold text-blue-600">{r.gpa}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    r.grade === 'F' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {r.grade}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [students, setStudents] = useState<Student[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [stats, setStats] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const fetchData = async () => {
    const [sRes, rRes, stRes] = await Promise.all([
      fetch('/api/students'),
      fetch('/api/results'),
      fetch('/api/dashboard')
    ]);
    setStudents(await sRes.json());
    setResults(await rRes.json());
    setStats(await stRes.json());
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  const handleCreateOrUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      rollNo: formData.get('rollNo'),
      department: formData.get('department'),
    };

    const url = editingStudent ? `/api/students/${editingStudent.id}` : '/api/students';
    const method = editingStudent ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    setShowAddForm(false);
    setEditingStudent(null);
    fetchData();
  };

  const handleDeleteStudent = async (id: string) => {
    // Note: We avoid window.confirm() because it is often blocked in sandboxed iframes.
    // In a real app, you'd use a custom modal here.
    try {
      const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredResults = results.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isLoggedIn) return <Login onLogin={() => setIsLoggedIn(true)} />;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0">
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <div className="bg-blue-600 p-2 rounded-lg">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">RMS Pro</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'students', label: 'Students', icon: Users },
            { id: 'marks', label: 'Add Marks', icon: Calculator },
            { id: 'results', label: 'Reports', icon: FileText },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id 
                  ? 'bg-blue-50 text-blue-600 shadow-sm border border-blue-100' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={() => setIsLoggedIn(false)}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-500 transition-colors text-sm font-medium"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight capitalize">{activeTab}</h1>
            <p className="text-slate-500 text-sm mt-1">Manage system records and performance</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name or roll no..." 
                className="bg-white border border-slate-200 pl-10 pr-4 py-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center font-bold text-blue-600">AD</div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && <DashboardHome stats={stats} />}
            {activeTab === 'students' && (
              <StudentsList 
                students={filteredStudents} 
                onAdd={() => { setEditingStudent(null); setShowAddForm(true); }}
                onEdit={(s) => { setEditingStudent(s); setShowAddForm(true); }}
                onDelete={handleDeleteStudent}
              />
            )}
            {activeTab === 'marks' && (
              <AddMarks 
                students={filteredStudents} 
                onSave={fetchData} 
              />
            )}
            {activeTab === 'results' && <ResultsTable results={filteredResults} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Student Form Modal (Add/Edit) */}
      {showAddForm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl"
          >
            <h3 className="text-xl font-bold mb-6">{editingStudent ? 'Edit Student' : 'Add New Student'}</h3>
            <form onSubmit={handleCreateOrUpdateStudent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input 
                  name="name" 
                  defaultValue={editingStudent?.name}
                  required 
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Roll Number</label>
                <input 
                  name="rollNo" 
                  defaultValue={editingStudent?.rollNo}
                  required 
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Department</label>
                <input 
                  name="department" 
                  defaultValue={editingStudent?.department}
                  required 
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => { setShowAddForm(false); setEditingStudent(null); }}
                  className="flex-1 py-2 text-slate-600 font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold shadow-lg shadow-blue-100 uppercase text-xs tracking-wider"
                >
                  {editingStudent ? 'Save Changes' : 'Add Student'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
