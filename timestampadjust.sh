#!/bin/bash
find "$@" -name \*.tid | while read filename; do
  # get all time stamps for the file, following renames
  allts=$( git log --follow --pretty=%at -- "$filename" )
  # get the oldest timestamp
  created=$( echo "$allts" | tail -1 )
  # get the newest timestamp
  modified=$( echo "$allts" | head -1 )
  # Now some patternmatching
  perl -MPOSIX -i -pe 'BEGIN {
      $ts{created}='$created';
      $ts{modified}='$modified';
      $ts{build}=time;
    }
    s/\$\{(created|modified|build)\s+(.*?)\}\$/strftime "$2",gmtime($ts{$1})/ge;
  ' "$filename"
done
