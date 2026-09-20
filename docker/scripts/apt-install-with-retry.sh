#!/usr/bin/env sh
set -eu

if [ "$#" -eq 0 ]; then
  echo "usage: apt-install-with-retry.sh <pkg> [<pkg> ...]" >&2
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive

refresh_indexes() {
  rm -rf /var/lib/apt/lists/*
  apt-get update -o Acquire::Retries=3
}

install_packages() {
  apt-get install -y --no-install-recommends --fix-missing "$@"
}

refresh_indexes

if ! install_packages "$@"; then
  echo "First apt install attempt failed; refreshing indexes and retrying once..." >&2
  refresh_indexes
  install_packages "$@"
fi

rm -rf /var/lib/apt/lists/*
