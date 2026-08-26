#!/usr/bin/env bash
# ailab.mju.ac.kr 로 사이트를 올린다.
#
#   npm run deploy
#
# GitHub Pages(ailab-mju.github.io)는 main 에 push 하면 워크플로가 알아서 올린다.
# 이 스크립트는 학교 도메인 쪽이다. 둘은 같은 커밋에서 나오지만 배포 시점이
# 다를 수 있다 — 어긋나면 푸터의 Last updated 날짜가 서로 달라 눈에 띈다.
#
# sudo 가 필요 없다. 배포 디렉터리가 noalcohol 소유다.
set -euo pipefail

DEST=/data/project/noalcohol/site
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
export PATH=/home/noalcohol/.local/node20/bin:$PATH

cd "$ROOT"

if [ -n "$(git status --porcelain)" ]; then
  echo "커밋되지 않은 변경이 있습니다. 푸터의 Last updated 는 최종 커밋 날짜라,"
  echo "지금 올리면 화면 내용과 날짜가 어긋납니다."
  git status --short
  exit 1
fi

# 푸터 날짜는 빌드 시각이 아니라 최종 커밋 날짜다. 재배포로 갱신되지 않는 게 목적이다.
BUILD_DATE="$(git log -1 --format=%cs)"
export BUILD_DATE

echo "[1/3] 빌드  (커밋 $(git rev-parse --short HEAD), Last updated ${BUILD_DATE})"
rm -rf .next
npm run build >/dev/null

echo "[2/3] $DEST 로 동기화"
mkdir -p "$DEST"
# --delete 로 지워진 파일까지 반영한다. out/ 이 사이트 전체다.
rsync -a --delete --checksum out/ "$DEST"/
chmod -R a+rX "$DEST"

echo "[3/3] 확인"
for p in "" "members/" "publications/" "research/" "gallery/" "news/" "teaching/" "join/"; do
  code="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 15 "https://ailab.mju.ac.kr/$p" || echo 000)"
  printf '  %-16s %s\n' "/$p" "$code"
  [ "$code" = "200" ] || echo "    ↑ 200 이 아닙니다. Apache 설정과 인증서를 확인하세요."
done

echo
echo "완료 → https://ailab.mju.ac.kr/"
