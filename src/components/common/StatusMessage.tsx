import OutlineButton from './OutlineButton';

/** 로딩·에러·빈 상태 공통 안내 */
export function LoadingMessage({ text = '불러오는 중이에요…' }: { text?: string }) {
  return (
    <p role="status" className="px-gutter pt-12 text-center text-13 text-gray-400">
      {text}
    </p>
  );
}

export function ErrorMessage({ error, onRetry }: { error: Error; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-4 px-gutter pt-12 text-center">
      <p className="text-14 text-gray-600">{error.message}</p>
      {onRetry && (
        <OutlineButton onClick={onRetry} className="max-w-[200px]">
          다시 시도
        </OutlineButton>
      )}
    </div>
  );
}
