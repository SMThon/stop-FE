import type { ChatMessage } from '@/types';

export const mockChatSuggestions = ['사용한 상품도 환불되나요?', '구독 해지를 깜빡했어요', '판매자가 환불을 거절해요'];

export const mockChatMessages: ChatMessage[] = [
  {
    id: 'm-1',
    role: 'ai',
    text: '안녕하세요, 정거장님.\n환불과 관련해 어떤 점이 궁금하신가요?',
    time: '오전 9:41',
  },
  {
    id: 'm-2',
    role: 'user',
    text: '온라인에서 산 옷을 한 번 입었는데 사이즈가 안 맞아요. 환불될까요?',
    time: '오전 9:43',
  },
  {
    id: 'm-3',
    role: 'ai',
    text: '착용으로 상품 가치가 감소했다면 단순 변심 환불이 어려울 수 있어요. 다만 **사이즈 표시 오류나 상품 하자**가 있었다면 환불을 요청할 수 있습니다.',
    time: '오전 9:43',
    lawUrl: 'https://www.law.go.kr',
  },
];

/** API 연동 전 임시 답변 */
export const mockAiReply =
  '말씀해주신 내용을 확인했어요. 구매처와 수령일을 알려주시면 **적용되는 환불 규정**을 정확히 찾아드릴게요.';
