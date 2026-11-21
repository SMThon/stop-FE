import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: { '@': path.resolve(__dirname, 'src') },
    },
    server: {
      // 개발 중에는 /api 요청을 로컬 FastAPI(uvicorn 기본 8000)로 넘긴다 → CORS 설정 불필요
      proxy: {
        '/api': { target: env.API_PROXY_TARGET || 'http://localhost:8000', changeOrigin: true },
      },
    },
  };
});
