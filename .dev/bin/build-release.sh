#!/bin/bash

PLUGIN="curatewp-nested-posts"

WORKING_DIR=`pwd`

mkdir -p release/$PLUGIN

rsync -av --progress --exclude={'wordpress','node_modules','src','release','.gitignore','composer.*','package*','phpcs.xml','README.md'} ./* release/$PLUGIN