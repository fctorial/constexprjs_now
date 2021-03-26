#!/usr/bin/env sh

rm -rf ../constexprjs_now_deployment/*
../ConstexprJS/constexpr.js "$@" --input . --output ../constexprjs_now_deployment --exclusion /_template.html --exclusion /posts/md_generator.html --exclusion /collections
