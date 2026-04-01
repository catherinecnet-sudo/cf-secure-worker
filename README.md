# Cloudflare CSE Technical Project

This project implements a Cloudflare-secured application using:

- Cloudflare Tunnel
- Cloudflare Zero Trust Access
- Cloudflare Worker
- Cloudflare R2

## Features

- Protected access to `tunnel.cath-best.site` using Zero Trust
- Worker on `/secure` that returns authenticated user identity information
- Country value rendered as a clickable link
- Flag assets served from a private R2 bucket

## Paths

- `/secure` → returns HTML with:
  - authenticated email
  - timestamp
  - country link
- `/secure/{COUNTRY}` → returns the country flag image from R2

## Implementation Summary

- Origin application exposed securely through Cloudflare Tunnel
- Access restricted with Cloudflare Zero Trust
- Worker route configured on `tunnel.cath-best.site/secure*`
- Private R2 bucket used for flag storage

## Repository Purpose

This repository contains the Worker implementation used for the Cloudflare CSE technical assessment. It demonstrates how Cloudflare Tunnel, Zero Trust Access, Workers, and R2 can be integrated to build a secure application flow.
