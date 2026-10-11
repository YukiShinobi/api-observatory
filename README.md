<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&height=210&text=API%20OBSERVATORY&fontAlignY=38&desc=REQUESTS%20%E2%80%A2%20TIMING%20%E2%80%A2%20DIFFS&descAlignY=58&color=0:050505,55:202020,100:5a1616&fontColor=f5f5f5&descColor=d4d4d4" width="100%" />

![Node](https://img.shields.io/badge/Node.js-20%2B-111111?style=for-the-badge&logo=nodedotjs)
![Tests](https://img.shields.io/badge/tests-node:test-2b2b2b?style=for-the-badge)
![Focus](https://img.shields.io/badge/focus-developer%20tooling-7a1f1f?style=for-the-badge)

**A small API inspection tool built to make request behaviour visible instead of guessing from logs.**

</div>

---

## What it does

API Observatory can probe HTTP endpoints, record status and response timing, redact sensitive response headers, keep a short request history, and compare responses without pulling in a heavy API client stack.

```txt
request
   ↓
probe + timer
   ↓
status / headers / body
   ↓
redaction + history
   ↓
summary / comparison
```

## Current build

- HTTP endpoint probing
- response-time measurement
- status/body/header capture
- redaction for `authorization`, cookies and API-key headers
- rolling request history
- timing summary (`min`, `max`, `avg`, `p95`)
- response comparison helper
- browser UI
- JSON API
- Node test suite

## Run

```bash
npm test
npm start
```

Default: `http://localhost:8088`

## Why I built it

I wanted a developer tool small enough that the network and comparison logic stays obvious. The interesting part here is not another Postman clone; it is the reusable request-analysis layer underneath one.

## Next

`collections` · `saved environments` · `request bodies` · `auth presets` · `response diff UI` · `latency history`

---

<div align="center"><sub>YukiShinobi // build the tool you wish you had while debugging.</sub></div>


## Scope and maintenance — October 2026

A network-debugging tool. Probe only endpoints you own or are authorised to test; redact credentials and sensitive response data.

This repository is separate from the current featured products: [Project Creation](https://github.com/YukiShinobi/project-creation), [Veyra](https://github.com/YukiShinobi/YukiShinobi-veyra), and [Simply Management](https://github.com/YukiShinobi/SIMPLYMANAGEMENT-WEBSITE). Its README does not constitute verification of a live production deployment.
