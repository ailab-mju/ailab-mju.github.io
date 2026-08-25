/** @type {import('next').NextConfig} */
const nextConfig = {
  // 조직 사이트(ailab-mju.github.io)는 루트로 서빙된다. **여기에 basePath를 적지 말 것.**
  //
  // 예외는 하나뿐이다: 하위 경로에 올려 미리 보여줄 때만 PREVIEW_BASE_PATH 로 준다.
  // 배포(GitHub Actions)에서는 이 환경변수가 없으므로 basePath는 undefined 로 남는다.
  //   PREVIEW_BASE_PATH=/static/preview npm run build
  basePath: process.env.PREVIEW_BASE_PATH || undefined,
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  env: {
    // public/ 아래 파일을 <img src> 로 직접 가리킬 때 붙일 접두사.
    // basePath 는 next/link·next/image 에만 자동 적용되고 생짜 경로에는 붙지 않는다.
    // 배포에서는 빈 문자열이므로 아무것도 달라지지 않는다.
    BASE_PATH: process.env.PREVIEW_BASE_PATH || '',
    // 푸터 "Last updated"의 기준값. GitHub Actions에서 커밋 시각을 주입한다.
    BUILD_DATE: process.env.BUILD_DATE || new Date().toISOString().slice(0, 10),
  },
};

export default nextConfig;
