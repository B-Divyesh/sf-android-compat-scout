#!/bin/sh
set -eu
repo="B-Divyesh/sf-android-compat-scout"
os="$(uname -s | tr '[:upper:]' '[:lower:]')"
arch="$(uname -m)"
case "$arch" in x86_64) arch="x86_64";; arm64|aarch64) arch="aarch64";; *) echo "Unsupported architecture: $arch" >&2; exit 1;; esac
case "$os" in linux) asset="compat-scout-${arch}-unknown-linux-musl.tar.gz";; darwin) asset="compat-scout-${arch}-apple-darwin.tar.gz";; *) echo "Use install.ps1 on Windows." >&2; exit 1;; esac
base="https://github.com/$repo/releases/latest/download"
tmp="$(mktemp -d)"; trap 'rm -rf "$tmp"' EXIT
curl -fsSL "$base/SHA256SUMS" -o "$tmp/SHA256SUMS"
curl -fsSL "$base/$asset" -o "$tmp/$asset"
(cd "$tmp" && grep " $asset$" SHA256SUMS | sha256sum -c -)
mkdir -p "$HOME/.local/bin"; tar -xzf "$tmp/$asset" -C "$tmp"
install "$tmp/compat-scout" "$HOME/.local/bin/compat-scout"
echo "Installed compat-scout in $HOME/.local/bin. Add it to PATH if needed."
