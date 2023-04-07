#!/bin/sh
docker=podman

$docker build base --tag validator-base

$docker build 1-1 --tag validator-1-1
$docker build 1-2 --tag validator-1-2
$docker build 1-3 --tag validator-1-3
$docker build 1-4 --tag validator-1-4
$docker build 1-5 --tag validator-1-5

$docker build 2-1 --tag validator-2-1
$docker build 2-2 --tag validator-2-2
$docker build 2-3 --tag validator-2-3
$docker build 2-4 --tag validator-2-4
$docker build 2-5 --tag validator-2-5

$docker build 3-1 --tag validator-3-1
$docker build 3-2 --tag validator-3-2
$docker build 3-3 --tag validator-3-3
$docker build 3-4 --tag validator-3-4