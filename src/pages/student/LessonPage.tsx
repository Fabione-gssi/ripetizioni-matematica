import { useEffect } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { BlockView } from '../../components/Blocks';
import { ErrorText, Header, useAction } from '../../components/ui';
import { unitById } from '../../content';
import { api } from '../../lib/app';

export function LessonPage() {
  const { unitId = '', lessonId = '' } = useParams();
  const nav = useNavigate();
  const act = useAction();
  const unit = unitById(unitId);
  const idx = unit?.lessons.findIndex((l) => l.id === lessonId) ?? -1;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [lessonId]);

  if (!unit || idx < 0) return <Navigate to="/" replace />;
  const lesson = unit.lessons[idx];
  const next = unit.lessons[idx + 1];

  const complete = () =>
    act.run(async () => {
      await api.completeLesson(lesson.id);
      nav(next ? `/u/${unit.id}/l/${next.id}` : `/u/${unit.id}/esercizi`);
    });

  return (
    <>
      <Header title={lesson.title} back={`/u/${unit.id}`} />
      <article className="lesson">
        {lesson.blocks.map((b, i) => (
          <BlockView key={`${lesson.id}-${i}`} b={b} />
        ))}
      </article>
      <ErrorText>{act.error}</ErrorText>
      <button className="btn block-btn" disabled={act.busy} onClick={() => void complete()}>
        {next ? 'Ho capito: prossima lezione' : 'Ho capito: vai agli esercizi'}
      </button>
      <Link className="btn ghost block-btn" to="/tutor" state={{ context: `${unit.title} — ${lesson.title}` }}>
        Ho un dubbio: chiedi al tutor
      </Link>
    </>
  );
}
