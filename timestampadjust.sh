#!/bin/bash
find "$@" -name \*.tid -name \*.tid | while read filename; do
  ts=$( git log -n1 --pretty=%at -- "$filename" )
  perl -MPOSIX -i -pe '
    s/\$\{strftime\s+(.*?)\}\$/strftime "$1",gmtime('$ts')/ge;
  ' "$filename"
done
