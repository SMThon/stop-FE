import type { ChatMessage } from '@/types';

/**
 * 백엔드에는 상담 기록 저장 API가 없어 이 브라우저(localStorage)에만 대화를 보관한다.
 * 설정 > AI 챗봇 기록 삭제가 이 저장소를 비운다.
 */
const KEY = 'refund-station.chat';

export const chatHistory = {
  load(): ChatMessage[] {
    try {
      const raw = localStorage.getItem(KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },
  save(messages: ChatMessage[]) {
    try {
      localStorage.setItem(KEY, JSON.stringify(messages));
    } catch {
      /* 저장 불가 환경 무시 */
    }
  },
  clear() {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* 무시 */
    }
  },
  /** 사용자가 보낸 질문 수 = 상담 건수 */
  count(): number {
    return chatHistory.load().filter((m) => m.role === 'user').length;
  },
};
