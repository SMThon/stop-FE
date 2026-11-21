import { useEffect, useRef, useState, type FormEvent } from 'react';
import Header from '@/components/common/Header';
import IconButton from '@/components/common/IconButton';
import { LawIcon, PlusIcon, SendIcon, SparkleIcon } from '@/components/icons';
import { mockAiReply, mockChatMessages, mockChatSuggestions } from '@/mocks/chat';
import type { ChatMessage } from '@/types';

/** '**강조**' 구간을 초록 굵은 글씨로 렌더링 */
function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
        part.startsWith('**') ? (
          <strong key={i} className="font-bold text-green-600">
            {part.slice(2, -2)}
          </strong>
        ) : (
          part
        ),
      )}
    </>
  );
}

function AiAvatar({ size }: { size: 'sm' | 'lg' }) {
  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center bg-green-800 text-green-200 ${
        size === 'lg' ? 'size-11 rounded-tile' : 'size-9 rounded-icon'
      }`}
    >
      <SparkleIcon size={size === 'lg' ? 22 : 18} />
    </span>
  );
}

function nowLabel() {
  const d = new Date();
  const h = d.getHours();
  return `${h < 12 ? '오전' : '오후'} ${h % 12 || 12}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/** Figma: 05 · AI 환불 상담 (4:513) */
export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [messages]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const time = nowLabel();
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: 'user', text: trimmed, time }]);
    setInput('');
    // TODO: AI API 연동. 지금은 mock 답변
    window.setTimeout(() => {
      setMessages((prev) => [...prev, { id: `a-${Date.now()}`, role: 'ai', text: mockAiReply, time: nowLabel() }]);
    }, 600);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <div className="flex min-h-[calc(100dvh-var(--spacing-nav))] flex-col bg-surface-chat">
      <Header
        variant="title"
        title="AI 환불 상담"
        right={
          <IconButton label="새 상담 시작" onClick={() => setMessages(mockChatMessages.slice(0, 1))}>
            <PlusIcon size={22} />
          </IconButton>
        }
      />

      <div className="flex items-center gap-3.5 border-b border-line bg-surface px-gutter py-4">
        <AiAvatar size="lg" />
        <div className="flex flex-col gap-1">
          <p className="text-15 font-bold text-ink">환불 가이드 AI</p>
          <p className="flex items-center gap-1.5 text-12 text-green-500">
            <span aria-hidden className="size-1.5 rounded-full bg-green-400" />
            온라인
          </p>
        </div>
      </div>

      <main className="flex flex-1 flex-col gap-4 px-gutter pt-5 pb-4" aria-live="polite">
        <span className="self-center rounded-full bg-line px-3.5 py-1.5 text-11 text-gray-400">오늘</span>

        {messages.map((m, i) =>
          m.role === 'ai' ? (
            <div key={m.id} className="flex gap-2.5">
              <AiAvatar size="sm" />
              <div className="flex max-w-[272px] flex-col gap-1.5">
                <div className="rounded-[20px] bg-surface px-4 py-4 text-13 leading-[21px] whitespace-pre-line text-ink">
                  <RichText text={m.text} />
                  {m.lawUrl && (
                    <a
                      href={m.lawUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 flex w-fit items-center gap-1.5 rounded-control bg-green-100 px-2.5 py-1.5 text-11 font-bold text-green-600"
                    >
                      <LawIcon size={16} />
                      관련 법령 확인
                    </a>
                  )}
                </div>
                <span className="text-10 text-gray-400">{m.time}</span>
                {i === 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {mockChatSuggestions.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => send(q)}
                        className="h-[30px] rounded-full border border-green-300 bg-surface px-3.5 text-12 whitespace-nowrap text-green-600"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div key={m.id} className="flex flex-col items-end gap-1.5">
              <div className="max-w-[214px] rounded-[20px] bg-green-700 px-4 py-4 text-13 leading-[21px] text-white">
                {m.text}
              </div>
              <span className="text-10 text-gray-400">{m.time}</span>
            </div>
          ),
        )}
        <div ref={endRef} />
      </main>

      <div className="sticky bottom-[calc(var(--spacing-nav)+env(safe-area-inset-bottom))] bg-surface-chat px-gutter pt-2 pb-4">
        <form onSubmit={handleSubmit} className="flex h-[58px] items-center gap-3 rounded-[22px] bg-surface pr-2 pl-4 shadow-card">
          <button type="button" aria-label="파일 첨부" className="text-gray-500">
            <PlusIcon size={22} />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="궁금한 내용을 입력하세요"
            aria-label="메시지 입력"
            className="min-w-0 flex-1 bg-transparent text-14 text-ink outline-none placeholder:text-gray-400"
          />
          <button
            type="submit"
            aria-label="보내기"
            className="flex size-11 shrink-0 items-center justify-center rounded-tile bg-green-700 text-white disabled:opacity-60"
            disabled={!input.trim()}
          >
            <SendIcon size={20} />
          </button>
        </form>
        <p className="mt-3 text-center text-10 text-gray-400">AI 답변은 참고용이며 법률 자문을 대신하지 않습니다.</p>
      </div>
    </div>
  );
}
