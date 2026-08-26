#!/usr/bin/env bash
# ailab.mju.ac.kr 를 이 서버에서 서빙하도록 Apache 를 바꾸고 HTTPS 를 붙인다.
#
#   sudo bash deploy/setup-server.sh
#
# 한 번만 돌리면 된다. 다시 돌려도 안전하다(이미 된 단계는 건너뛴다).
# 이후 사이트 갱신은 sudo 없이 `npm run deploy` 로 한다.
#
# 안전장치: 문법 검사에 실패하면 원래 설정으로 되돌리고 reload 를 하지 않는다.
# 그 경우 서버는 지금 돌던 상태 그대로 살아 있다.
set -euo pipefail

DOMAIN=ailab.mju.ac.kr
EMAIL=msoh@mju.ac.kr
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$REPO/deploy/ailab-mju.conf"
OLD_SITE=gene_network
NEW_SITE=ailab-mju

[ "$(id -u)" -eq 0 ] || { echo "root 로 실행하세요:  sudo bash $0"; exit 1; }
[ -f "$SRC" ] || { echo "설정 파일이 없습니다: $SRC"; exit 1; }

step() { printf '\n\033[1m[%s]\033[0m %s\n' "$1" "$2"; }

step 1/6 "certbot 설치"
if command -v certbot >/dev/null; then
  echo "  이미 설치돼 있습니다 ($(certbot --version 2>&1))"
else
  apt-get update -qq
  apt-get install -y -qq certbot python3-certbot-apache
fi

step 2/6 "Apache 모듈 켜기 (ssl rewrite headers expires)"
a2enmod -q ssl rewrite headers expires

step 3/6 "vhost 설치"
install -m 644 "$SRC" /etc/apache2/sites-available/${NEW_SITE}.conf
echo "  /etc/apache2/sites-available/${NEW_SITE}.conf"

step 4/6 "사이트 전환 + 문법 검사"
# 둘 다 ServerName 이 같다. 옛것을 끄지 않으면 어느 쪽이 이길지 알 수 없다.
a2ensite -q ${NEW_SITE}
a2dissite -q ${OLD_SITE} 2>/dev/null || true

if ! apache2ctl configtest; then
  echo
  echo "문법 검사 실패 — 원래 설정으로 되돌립니다. reload 는 하지 않았으므로"
  echo "서버는 지금 돌던 상태 그대로입니다."
  a2dissite -q ${NEW_SITE} || true
  a2ensite  -q ${OLD_SITE} || true
  exit 1
fi

step 5/6 "reload"
systemctl reload apache2
sleep 1
code="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 15 http://${DOMAIN}/ || echo 000)"
echo "  http://${DOMAIN}/  →  ${code}"
if [ "$code" != "200" ]; then
  echo "  200 이 아닙니다. 되돌립니다."
  a2dissite -q ${NEW_SITE} || true
  a2ensite  -q ${OLD_SITE} || true
  systemctl reload apache2
  exit 1
fi

step 6/6 "인증서 발급 + https 리다이렉트"
if [ -d "/etc/letsencrypt/live/${DOMAIN}" ]; then
  echo "  인증서가 이미 있습니다. 갱신은 certbot 타이머가 합니다."
else
  certbot --apache -d "${DOMAIN}" --redirect --agree-tos -m "${EMAIL}" --no-eff-email --non-interactive
fi

echo
echo "── 확인 ──"
for p in "" "members/" "publications/" "research/" "gallery/" "TFNetPropX/" "OlinkWeb/" "static/preview/"; do
  printf '  %-18s %s\n' "/$p" "$(curl -sSL -o /dev/null -w '%{http_code}' --max-time 15 "https://${DOMAIN}/$p" || echo 000)"
done
echo
echo "  /TFNetPropX/ 와 /OlinkWeb/ 은 백엔드가 꺼져 있으면 503 이 정상입니다."
echo "  (경로가 살아 있다는 뜻이고, 404 가 나오면 설정이 잘못된 것입니다.)"
echo
echo "완료 → https://${DOMAIN}/"
