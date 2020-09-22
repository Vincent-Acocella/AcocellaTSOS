#!/bin/sh
java -cp "tsc --rootDir source/ --outDir distrib/  source/*.ts source/host/*.ts source/os/*.ts"
