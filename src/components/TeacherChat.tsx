// Chat asincrona studente–professore (stesso componente per entrambi i ruoli).
import { useEffect } from 'react';
import { api, useLoad, useMe } from '../lib/app';
import { Chat } from './Chat';
import { Loadable } from './ui';

export function TeacherChat({ studentId, teacherId }: { studentId: string; teacherId: string }) {
  const me = useMe();
  const msgs = useLoad(() => api.listMessages(studentId, teacherId), [studentId, teacherId]);
  const { reload } = msgs;

  useEffect(() => api.onNewMessage(() => void reload(true)), [reload]);

  const count = msgs.data?.length ?? 0;
  useEffect(() => {
    if (count) void api.markRead(studentId, teacherId).catch(() => {});
  }, [count, studentId, teacherId]);

  const send = async (text: string) => {
    try {
      await api.sendMessage(studentId, teacherId, text);
      await reload(true);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <Loadable state={msgs}>
      {(list) => (
        <Chat
          bubbles={list.map((m) => ({ id: m.id, mine: m.sender_id === me.id, body: m.body, at: m.created_at }))}
          onSend={send}
          placeholder="Scrivi un messaggio… (formule tra $…$)"
          empty="Nessun messaggio. Scrivi tu il primo: la risposta arriverà appena possibile."
          maxLength={4000}
        />
      )}
    </Loadable>
  );
}
