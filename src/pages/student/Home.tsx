import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header, Loadable, Progress } from '../../components/ui';
import { units } from '../../content';
import { api, useLoad, useMe } from '../../lib/app';

export function Home() {
  const me = useMe();
  const [year, setYear] = useState<3 | 4>(me.school_year === 4 ? 4 : 3);
  const progress = useLoad(() => api.listProgress(me.id), [me.id]);

  return (
    <>
      <Header title={`Ciao, ${me.full_name.split(' ')[0]}`} />
      <div className="seg">
        {([3, 4] as const).map((y) => (
          <button key={y} className={year === y ? 'active' : ''} onClick={() => setYear(y)}>
            {y}° anno
          </button>
        ))}
      </div>
      <Loadable state={progress}>
        {(rows) => {
          const done = new Set(rows.map((r) => r.lesson_id));
          return (
            <div className="list">
              {units
                .filter((u) => u.year === year)
                .map((u, i) => {
                  const n = u.lessons.filter((l) => done.has(l.id)).length;
                  return (
                    <Link key={u.id} to={`/u/${u.id}`} className="card unit-card">
                      <span className="unit-n">{i + 1}</span>
                      <div>
                        <h3>{u.title}</h3>
                        <p className="muted">{u.summary}</p>
                        <Progress value={n} max={u.lessons.length} />
                        <span className="small muted">
                          {n}/{u.lessons.length} lezioni completate
                        </span>
                      </div>
                    </Link>
                  );
                })}
            </div>
          );
        }}
      </Loadable>
    </>
  );
}
