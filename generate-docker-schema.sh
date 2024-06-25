#!/bin/sh

npx openapi-typescript https://docs.docker.com/reference/engine/v1.45.yaml -o src/docker-schema.d.ts
