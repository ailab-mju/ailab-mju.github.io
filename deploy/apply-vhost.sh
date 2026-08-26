#!/usr/bin/env bash
# deploy/ailab-mju.conf 를 서버에 적용한다.
#
#   sudo bash deploy/apply-vhost.sh
#
# 설정을 고쳤을 때마다 돌린다 — 새 연구실 도구 경로를 추가했을 때가 대표적이다.
# 저장소의 conf 가 정본이다. 서버의 /etc/apache2/... 를 직접 고치면 다음 적용 때
# 덮어써진다.
#
# certbot 이 만든 SSL 쪽(ailab-mju-le-ssl.conf)은 건드리지 않는다.
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$REPO/deploy/ailab-mju.conf"
DST=/etc/apache2/sites-available/ailab-mju.conf
BACKUP="/etc/apache2/sites-available/ailab-mju.conf.bak"

[ "$(id -u)" -eq 0 ] || { echo "root 로 실행하세요:  sudo bash $0"; exit 1; }
[ -f "$SRC" ] || { echo "설정 파일이 없습니다: $SRC"; exit 1; }

[ -f "$DST" ] && cp -a "$DST" "$BACKUP" && echo "이전 설정 백업: $BACKUP"

install -m 644 "$SRC" "$DST"
echo "적용: $DST"

if ! apache2ctl configtest; then
  echo
  echo "문법 검사 실패 — 백업으로 되돌립니다. reload 를 하지 않았으므로"
  echo "서버는 지금 돌던 상태 그대로입니다."
  [ -f "$BACKUP" ] && install -m 644 "$BACKUP" "$DST"
  exit 1
fi

systemctl reload apache2
sleep 1

echo
echo "── 확인 ──"
code80="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 15 -H 'Host: ailab.mju.ac.kr' http://127.0.0.1/ || echo 000)"
echo "  http (리다이렉트 없이 200 이어야 합니다):  $code80"
if [ "$code80" = "301" ] || [ "$code80" = "302" ]; then
  echo
  echo "  ⚠ 아직 https 로 튕깁니다. 교내 방화벽이 443 을 막고 있으면"
  echo "    외부 방문자는 사이트를 열 수 없습니다."
  echo "    certbot 을 --redirect 로 다시 돌리지 마세요."
fi
for p in "" "members/" "TFNetPropX/" "OlinkWeb/"; do
  printf '  %-16s %s\n' "/$p" "$(curl -sS -o /dev/null -w '%{http_code}' --max-time 15 -H 'Host: ailab.mju.ac.kr' "http://127.0.0.1/$p" || echo 000)"
done
echo
echo "  도구는 백엔드가 꺼져 있으면 503 이 정상입니다(404 면 설정 문제)."
