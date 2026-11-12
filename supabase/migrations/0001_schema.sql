-- Ripetizioni di Matematica — schema completo e regole di sicurezza (RLS).
-- Esegui questo file UNA volta nel SQL Editor di Supabase (o con `supabase db push`).
-- Principio: ogni studente vede solo i propri dati; un professore vede i dati
-- dei soli studenti che lo hanno scelto e che lui ha accettato.

-- ============ Tabelle ============

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('student', 'teacher')),
  full_name text not null check (char_length(full_name) between 1 and 80),
  school_year int check (school_year between 1 and 5),
  accepting boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.links (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  teacher_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamptz not null default now(),
  decided_at timestamptz,
  check (student_id <> teacher_id)
);
-- Uno studente può avere una sola richiesta attiva (in attesa o accettata).
create unique index links_one_active on public.links (student_id) where status in ('pending', 'accepted');
create index links_teacher on public.links (teacher_id, status);

create table public.progress (
  student_id uuid not null references public.profiles (id) on delete cascade,
  lesson_id text not null check (char_length(lesson_id) <= 80),
  completed_at timestamptz not null default now(),
  primary key (student_id, lesson_id)
);

create table public.attempts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  unit_id text not null check (char_length(unit_id) <= 80),
  exercise_id text not null check (char_length(exercise_id) <= 80),
  mode text not null check (mode in ('guided', 'hints', 'solo', 'test')),
  level int not null check (level between 1 and 3),
  correct boolean not null,
  hints_used int not null default 0 check (hints_used between 0 and 50),
  question text not null check (char_length(question) <= 4000),
  given text not null check (char_length(given) <= 1000),
  created_at timestamptz not null default now()
);
create index attempts_student on public.attempts (student_id, created_at desc);

create table public.test_results (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  unit_id text not null check (char_length(unit_id) <= 80),
  score int not null check (score >= 0),
  total int not null check (total between 1 and 100),
  grade numeric(3, 1) not null check (grade between 1 and 10),
  duration_s int not null check (duration_s >= 0),
  details jsonb not null default '[]'::jsonb check (pg_column_size(details) < 100000),
  created_at timestamptz not null default now(),
  check (score <= total)
);
create index test_results_student on public.test_results (student_id, created_at desc);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  teacher_id uuid not null references public.profiles (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  body text not null check (char_length(body) between 1 and 4000),
  created_at timestamptz not null default now(),
  read_at timestamptz
);
create index messages_thread on public.messages (student_id, teacher_id, created_at);

create table public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  body text not null check (char_length(body) <= 12000),
  created_at timestamptz not null default now()
);
create index ai_messages_student on public.ai_messages (student_id, created_at);

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  teacher_id uuid not null references public.profiles (id) on delete cascade,
  image_path text not null check (char_length(image_path) <= 200),
  note text not null default '' check (char_length(note) <= 2000),
  unit_id text check (char_length(unit_id) <= 80),
  status text not null default 'pending' check (status in ('pending', 'reviewed')),
  verdict text check (verdict in ('correct', 'partial', 'wrong')),
  feedback text check (char_length(feedback) <= 4000),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);
create index submissions_student on public.submissions (student_id, created_at desc);

-- ============ Funzioni di supporto (security definer: non soggette a RLS) ============

create function public.my_role() returns text
language sql stable security definer set search_path = '' as $$
  select role from public.profiles where id = (select auth.uid());
$$;

-- Vero se l'utente corrente è il professore accettato dello studente indicato.
create function public.is_teacher_of(student uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.links
    where student_id = student and teacher_id = (select auth.uid()) and status = 'accepted'
  );
$$;

-- Vero se tra l'utente corrente e l'altro esiste una richiesta attiva (in attesa o accettata).
create function public.has_link_with(other uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.links
    where status in ('pending', 'accepted')
      and ((student_id = (select auth.uid()) and teacher_id = other)
        or (teacher_id = (select auth.uid()) and student_id = other))
  );
$$;

create function public.accepted_pair(student uuid, teacher uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.links
    where student_id = student and teacher_id = teacher and status = 'accepted'
  );
$$;

create function public.is_available_teacher(teacher uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles where id = teacher and role = 'teacher' and accepting);
$$;

-- ============ Trigger ============

-- Crea il profilo alla registrazione, dai metadati forniti dall'app.
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  r text := coalesce(new.raw_user_meta_data ->> 'role', 'student');
  y int;
begin
  if r not in ('student', 'teacher') then r := 'student'; end if;
  begin
    y := (new.raw_user_meta_data ->> 'school_year')::int;
  exception when others then y := null;
  end;
  if y is not null and (y < 1 or y > 5) then y := null; end if;
  insert into public.profiles (id, role, full_name, school_year)
  values (
    new.id, r,
    left(coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), 'Utente'), 80),
    case when r = 'student' then y else null end
  );
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Il ruolo non può essere cambiato dopo la registrazione.
create function public.protect_profile() returns trigger
language plpgsql as $$
begin
  new.id := old.id;
  new.role := old.role;
  new.created_at := old.created_at;
  return new;
end;
$$;
create trigger protect_profile before update on public.profiles
  for each row execute function public.protect_profile();

-- Il professore può solo accettare o rifiutare una richiesta in attesa.
create function public.protect_link() returns trigger
language plpgsql as $$
begin
  if old.status <> 'pending' or new.status not in ('accepted', 'rejected') then
    raise exception 'Transizione di stato non consentita';
  end if;
  new.id := old.id;
  new.student_id := old.student_id;
  new.teacher_id := old.teacher_id;
  new.created_at := old.created_at;
  new.decided_at := now();
  return new;
end;
$$;
create trigger protect_link before update on public.links
  for each row execute function public.protect_link();

-- Il professore può solo aggiungere esito e commento a una consegna.
create function public.protect_submission() returns trigger
language plpgsql as $$
begin
  if new.verdict is null then raise exception 'Esito mancante'; end if;
  new.id := old.id;
  new.student_id := old.student_id;
  new.teacher_id := old.teacher_id;
  new.image_path := old.image_path;
  new.note := old.note;
  new.unit_id := old.unit_id;
  new.created_at := old.created_at;
  new.status := 'reviewed';
  new.reviewed_at := now();
  return new;
end;
$$;
create trigger protect_submission before update on public.submissions
  for each row execute function public.protect_submission();

-- ============ RPC ============

-- Segna come letti i messaggi ricevuti in una conversazione.
create function public.mark_thread_read(p_student uuid, p_teacher uuid) returns void
language sql security definer set search_path = '' as $$
  update public.messages set read_at = now()
  where student_id = p_student and teacher_id = p_teacher
    and read_at is null
    and sender_id <> (select auth.uid())
    and (select auth.uid()) in (student_id, teacher_id);
$$;

-- Cancella definitivamente l'account dell'utente corrente e tutti i suoi dati.
create function public.delete_my_account() returns void
language sql security definer set search_path = '' as $$
  delete from auth.users where id = (select auth.uid());
$$;

revoke execute on function public.mark_thread_read(uuid, uuid) from public, anon;
revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.mark_thread_read(uuid, uuid) to authenticated;
grant execute on function public.delete_my_account() to authenticated;

-- ============ Row Level Security ============

alter table public.profiles enable row level security;
alter table public.links enable row level security;
alter table public.progress enable row level security;
alter table public.attempts enable row level security;
alter table public.test_results enable row level security;
alter table public.messages enable row level security;
alter table public.ai_messages enable row level security;
alter table public.submissions enable row level security;

-- profiles: il proprio, i professori disponibili, la controparte di una richiesta attiva
create policy profiles_select on public.profiles for select to authenticated using (
  id = (select auth.uid())
  or (role = 'teacher' and accepting)
  or public.has_link_with(id)
);
create policy profiles_update on public.profiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- links
create policy links_select on public.links for select to authenticated using (
  student_id = (select auth.uid()) or teacher_id = (select auth.uid())
);
create policy links_insert on public.links for insert to authenticated with check (
  student_id = (select auth.uid())
  and status = 'pending'
  and decided_at is null
  and public.my_role() = 'student'
  and public.is_available_teacher(teacher_id)
);
create policy links_update on public.links for update to authenticated
  using (teacher_id = (select auth.uid())) with check (teacher_id = (select auth.uid()));
create policy links_delete on public.links for delete to authenticated using (
  student_id = (select auth.uid()) or teacher_id = (select auth.uid())
);

-- progress / attempts / test_results: scrive lo studente, leggono studente e suo professore
create policy progress_select on public.progress for select to authenticated using (
  student_id = (select auth.uid()) or public.is_teacher_of(student_id)
);
create policy progress_insert on public.progress for insert to authenticated with check (student_id = (select auth.uid()));

create policy attempts_select on public.attempts for select to authenticated using (
  student_id = (select auth.uid()) or public.is_teacher_of(student_id)
);
create policy attempts_insert on public.attempts for insert to authenticated with check (student_id = (select auth.uid()));

create policy tests_select on public.test_results for select to authenticated using (
  student_id = (select auth.uid()) or public.is_teacher_of(student_id)
);
create policy tests_insert on public.test_results for insert to authenticated with check (student_id = (select auth.uid()));

-- messages: solo tra studente e professore associati
create policy messages_select on public.messages for select to authenticated using (
  student_id = (select auth.uid()) or teacher_id = (select auth.uid())
);
create policy messages_insert on public.messages for insert to authenticated with check (
  sender_id = (select auth.uid())
  and (select auth.uid()) in (student_id, teacher_id)
  and read_at is null
  and public.accepted_pair(student_id, teacher_id)
);

-- ai_messages: sola lettura dal client (scrive la Edge Function con la service role)
create policy ai_select on public.ai_messages for select to authenticated using (
  student_id = (select auth.uid()) or public.is_teacher_of(student_id)
);

-- submissions
create policy subs_select on public.submissions for select to authenticated using (
  student_id = (select auth.uid()) or (teacher_id = (select auth.uid()) and public.is_teacher_of(student_id))
);
create policy subs_insert on public.submissions for insert to authenticated with check (
  student_id = (select auth.uid())
  and status = 'pending' and verdict is null and feedback is null and reviewed_at is null
  and public.accepted_pair(student_id, teacher_id)
  and image_path like (select auth.uid())::text || '/%'
);
create policy subs_update on public.submissions for update to authenticated
  using (teacher_id = (select auth.uid()) and public.is_teacher_of(student_id))
  with check (teacher_id = (select auth.uid()));

-- ============ Archivio foto (privato) ============

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('submissions', 'submissions', false, 3145728, array['image/jpeg'])
on conflict (id) do nothing;

-- Ogni studente carica solo nella cartella col proprio id; la vede lui e il suo professore.
create policy submissions_upload on storage.objects for insert to authenticated with check (
  bucket_id = 'submissions' and (storage.foldername(name))[1] = (select auth.uid())::text
);
create policy submissions_read on storage.objects for select to authenticated using (
  bucket_id = 'submissions' and (
    (storage.foldername(name))[1] = (select auth.uid())::text
    or public.is_teacher_of(((storage.foldername(name))[1])::uuid)
  )
);
create policy submissions_remove on storage.objects for delete to authenticated using (
  bucket_id = 'submissions' and (storage.foldername(name))[1] = (select auth.uid())::text
);

-- ============ Realtime (chat) ============

alter publication supabase_realtime add table public.messages;
