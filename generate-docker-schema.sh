#!/bin/sh

npx swagger-typescript-api generate -p https://docs.docker.com/reference/api/engine/version/v1.52.yaml -o src/docker-schema.d.ts