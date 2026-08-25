#!/usr/bin/env bash
# 학생들에게 보여줄 미리보기를 이 서버의 Apache 경로에 올린다.
#
#   http://ailab.mju.ac.kr/static/preview/
#
# 3008 포트는 학교 방화벽에 막혀 밖에서 안 열린다. 80 포트(Apache)는 열려 있으므로
# 이미 서빙 중인 Alias 경로 아래로 넣는다. 하위 경로라 basePath 가 필요하다 —
# 그래서 이 스크립트로만 빌드하고, 끝나면 배포용(basePath 없음)으로 되돌린다.
#
# 정식 배포가 아니다. GitHub Pages 로 올리면 이 경로는 지워도 된다:
#   rm -rf /data/project/noalcohol/web_tool/gene_network/static/preview
set -euo pipefail

BASE=/static/preview
DEST=/data/project/noalcohol/web_tool/gene_network/static/preview
export PATH=/home/noalcohol/.local/node20/bin:$PATH

echo "[1/3] basePath=$BASE 로 빌드"
rm -rf .next
PREVIEW_BASE_PATH=$BASE npm run build >/dev/null

echo "[2/3] $DEST 로 복사"
rm -rf "$DEST"
mkdir -p "$DEST"
cp -r out/. "$DEST"/
chmod -R a+rX "$DEST"

echo "[3/3] out/ 을 배포용(basePath 없음)으로 되돌림"
rm -rf .next
npm run build >/dev/null

echo
echo "완료 → http://ailab.mju.ac.kr/static/preview/"
