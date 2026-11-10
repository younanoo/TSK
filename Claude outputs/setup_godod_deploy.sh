#!/usr/bin/env bash
# One-time setup for GitHub Actions auto-deploy of godod (git pull over SSH).
# Run ON THE SERVER as the deploy user (NOT root):
#     sudo -iu deploy          # or log in as deploy
#     bash setup_godod_deploy.sh <SERVER_PUBLIC_IP> [SSH_PORT]
#
# Touches ONLY: ~deploy/.ssh/authorized_keys (append one line, after a backup),
# a temporary key file in ~deploy/.ssh (deleted at the end), and - only if you
# confirm - the git remote URL of /var/www/godod.
# It does NOT touch nginx, Nginx Proxy Manager, Docker, Cloudflare, SSL, ports or the CRM.
set -euo pipefail

SITE=/var/www/godod
HOST_ADDR="${1:?Usage: bash setup_godod_deploy.sh <SERVER_PUBLIC_IP> [SSH_PORT]}"
PORT="${2:-22}"
KEY="$HOME/.ssh/github_actions_godod"
REPO_HTTPS="https://github.com/younanoo/TSK.git"

confirm() { read -rp "$1 [y/N] " a; [ "${a:-}" = "y" ] || [ "${a:-}" = "Y" ]; }

echo "================ 1) Read-only checks ================"
echo "+ whoami";                         whoami
[ "$(whoami)" = "deploy" ] || { echo "!! Run this as the deploy user, not $(whoami)"; exit 1; }
echo "+ login shell: $(getent passwd deploy | cut -d: -f7)"
echo "+ git -C $SITE status";            git -C "$SITE" status
echo "+ git -C $SITE remote -v";         git -C "$SITE" remote -v
echo "+ git -C $SITE branch --show-current"; git -C "$SITE" branch --show-current
echo "+ ls -la ~/.ssh";                  ls -la "$HOME/.ssh"
echo "+ ownership";                      stat -c '%U:%G %a %n' "$SITE" "$SITE/.git"
echo "+ test: can deploy fetch from GitHub without a password? (dry-run, changes nothing)"
if GIT_TERMINAL_PROMPT=0 git -C "$SITE" fetch --dry-run origin main; then
  echo "   fetch OK"; FETCH_OK=1
else
  echo "   fetch FAILED"; FETCH_OK=0
fi

echo
echo "================ 2) Git remote (only if needed) ================"
CUR_URL=$(git -C "$SITE" remote get-url origin)
if [ "$FETCH_OK" = 0 ] || [ "$CUR_URL" != "$REPO_HTTPS" ]; then
  echo "Current origin: $CUR_URL"
  echo "Public repo -> simplest secure option is anonymous HTTPS (no token, no key)."
  echo "Command:  git -C $SITE remote set-url origin $REPO_HTTPS"
  if confirm "Run it?"; then
    git -C "$SITE" remote set-url origin "$REPO_HTTPS"
    GIT_TERMINAL_PROMPT=0 git -C "$SITE" fetch --dry-run origin main && echo "   fetch OK now"
  fi
else
  echo "origin is already $REPO_HTTPS and fetch works - nothing to change."
fi

echo
echo "================ 3) Deploy key for GitHub Actions ================"
if grep -q "github-actions-godod" "$HOME/.ssh/authorized_keys" 2>/dev/null; then
  echo "A github-actions-godod key is already in authorized_keys - skipping key creation."
  echo "(Delete that line first if you want a new key.)"
else
  echo "Will run:"
  echo "  ssh-keygen -t ed25519 -N '' -C github-actions-godod -f $KEY"
  echo "  cp ~/.ssh/authorized_keys ~/.ssh/authorized_keys.bak-<date>   (backup)"
  echo "  append:  restrict <public key>   to ~/.ssh/authorized_keys"
  echo "  ('restrict' = no port forwarding, no agent/X11 forwarding, no PTY for this key)"
  if confirm "Continue?"; then
    rm -f "$KEY" "$KEY.pub"
    ssh-keygen -q -t ed25519 -N '' -C github-actions-godod -f "$KEY"
    touch "$HOME/.ssh/authorized_keys"
    cp -p "$HOME/.ssh/authorized_keys" "$HOME/.ssh/authorized_keys.bak-$(date +%Y%m%d-%H%M%S)"
    printf 'restrict %s\n' "$(cat "$KEY.pub")" >> "$HOME/.ssh/authorized_keys"
    chmod 700 "$HOME/.ssh"; chmod 600 "$HOME/.ssh/authorized_keys"
    echo "   key added to authorized_keys"
  else
    echo "Stopped."; exit 0
  fi
fi

echo
echo "================ 4) Values for GitHub Secrets ================"
if [ "$PORT" = "22" ]; then HK_NAME="$HOST_ADDR"; else HK_NAME="[$HOST_ADDR]:$PORT"; fi
echo "SERVER_HOST        = $HOST_ADDR"
echo "SERVER_USER        = deploy"
[ "$PORT" != "22" ] && echo "SERVER_PORT        = $PORT"
echo "SERVER_KNOWN_HOSTS = (one line below - read from this server's own host key file, so it can't be spoofed)"
for f in /etc/ssh/ssh_host_ed25519_key.pub; do
  [ -r "$f" ] && echo "$HK_NAME $(cut -d' ' -f1,2 "$f")"
done
if [ -f "$KEY" ]; then
  echo
  echo "SERVER_SSH_KEY = everything between the two lines below (including BEGIN/END):"
  echo "------------------------------------------------------------------"
  cat "$KEY"
  echo "------------------------------------------------------------------"
  read -rp "After you have pasted it into GitHub Secrets, press Enter to delete the private key from this server..." _
  shred -u "$KEY" 2>/dev/null || rm -f "$KEY"
  echo "   private key deleted from the server (public key stays in authorized_keys)."
fi
echo
echo "Done. Nothing else on the server was changed."
