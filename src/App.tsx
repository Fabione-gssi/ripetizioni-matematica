import { Component, useEffect, useRef, type ReactNode } from 'react';
import { HashRouter, NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { Spinner } from './components/ui';
import { api, AuthProvider, useAuth } from './lib/app';
import { AuthPage } from './pages/Auth';
import { ProfilePage } from './pages/Profile';
import { Home } from './pages/student/Home';
import { LessonPage } from './pages/student/LessonPage';
import { Practice } from './pages/student/Practice';
import { ProfPage } from './pages/student/ProfPage';
import { TestPage } from './pages/student/TestPage';
import { Tutor } from './pages/student/Tutor';
import { UnitPage } from './pages/student/UnitPage';
import { Dashboard } from './pages/teacher/Dashboard';
import { StudentDetail } from './pages/teacher/StudentDetail';

/** Evita la schermata bianca in caso di errore imprevisto. */
class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="page center">
        <h2>Qualcosa è andato storto</h2>
        <p>Riapri la pagina per continuare.</p>
        <button
          className="btn"
          onClick={() => {
            window.location.hash = '#/';
            window.location.reload();
          }}
        >
          Ricarica
        </button>
      </div>
    );
  }
}

function Nav({ items }: { items: { to: string; label: string; icon: string }[] }) {
  return (
    <nav className="bottom-nav">
      {items.map((i) => (
        <NavLink key={i.to} to={i.to} end={i.to === '/'}>
          <span aria-hidden="true">{i.icon}</span>
          {i.label}
        </NavLink>
      ))}
    </nav>
  );
}

function Shell() {
  const { profile, loading } = useAuth();
  const nav = useNavigate();
  const lastUser = useRef<string | null | undefined>(undefined);
  const userId = loading ? undefined : (profile?.id ?? null);
  // Al cambio di utente (accesso, uscita) si riparte sempre dalla pagina iniziale.
  useEffect(() => {
    if (userId === undefined) return;
    if (lastUser.current !== undefined && lastUser.current !== userId) nav('/', { replace: true });
    lastUser.current = userId;
  }, [userId, nav]);
  if (loading) return <Spinner />;
  if (!profile) return <AuthPage />;
  const student = profile.role === 'student';
  return (
    <>
      {api.demo && <div className="demo-banner">Modalità demo: i dati restano solo su questo dispositivo</div>}
      <main className="page">
        {student ? (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/u/:unitId" element={<UnitPage />} />
            <Route path="/u/:unitId/l/:lessonId" element={<LessonPage />} />
            <Route path="/u/:unitId/esercizi" element={<Practice />} />
            <Route path="/u/:unitId/verifica" element={<TestPage />} />
            <Route path="/tutor" element={<Tutor />} />
            <Route path="/prof" element={<ProfPage />} />
            <Route path="/profilo" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/s/:studentId" element={<StudentDetail />} />
            <Route path="/profilo" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </main>
      <Nav
        items={
          student
            ? [
                { to: '/', label: 'Studia', icon: '📘' },
                { to: '/tutor', label: 'Tutor AI', icon: '💬' },
                { to: '/prof', label: 'Il mio prof', icon: '🎓' },
                { to: '/profilo', label: 'Profilo', icon: '👤' },
              ]
            : [
                { to: '/', label: 'Studenti', icon: '👥' },
                { to: '/profilo', label: 'Profilo', icon: '👤' },
              ]
        }
      />
    </>
  );
}

export function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <HashRouter>
          <Shell />
        </HashRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
