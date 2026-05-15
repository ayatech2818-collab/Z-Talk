# Project Log — Z-Talk

## Project Overview

Z-Talk — [to be filled as project scope solidifies]

---

## Agent Training Guide

This log is designed to train AI agents (including this one) for better usage and output. Here's how:

### How this log trains the agent

| Mechanism | Purpose |
|---|---|
| **Exact commands** | Agent learns which CLI commands to run, in what order |
| **Error + fix pairs** | Agent learns recovery patterns (critical for autonomy) |
| **Decision rationale** | Agent learns *why* choices were made, not just *what* |
| **Precise file paths** | Agent learns project layout without guessing |
| **Before/after state** | Agent learns what constitutes progress |
| **Environment context** | Agent learns platform constraints (OS, runtimes, etc.) |

### Rules for writing entries (for any agent)

1. **Be specific** — always include exact file paths, line numbers, and commands
2. **Show the failure** — if something broke, log the error and how it was fixed
3. **State the context** — what was the problem, what was the goal
4. **Link decisions to outcomes** — if you chose X over Y, note what happened
5. **Log verification steps** — how was the work validated (tests, lint, visual check)?
6. **Write for the next agent** — include enough context so a fresh agent can continue seamlessly

### Mandatory protocol: Check before EVERY step

The agent **must** follow this protocol for every single step. Skipping any check is itself a mistake.

#### Phase 1 — Session start (once per session)

1. **Read Mistakes Registry** — check if current task matches any known mistake
2. **Read Architecture Decisions** — understand project rationale
3. **Read last Session Log** — know where work left off
4. **Read Active Todos** — know what's pending
5. **Verify working directory** — confirm `pwd` matches expected project root

#### Phase 2 — Per-step check (before EVERY action)

| # | Check | What to verify |
|---|---|---|
| 1 | **Read current state** | Re-read the file(s) you're about to modify — never assume you know the content |
| 2 | **Verify file path** | Does the target file exist? Is it the right path? Use `ls` or glob to confirm |
| 3 | **Check Mistakes Registry** | Does this action match any row in the registry? If yes, follow the prevention strategy |
| 4 | **Check working directory** | Are you in the correct directory? Wrong dir = wrong results |
| 5 | **Dry-run mental model** | Before running a command: what do you expect the output to be? If the actual output differs, stop and investigate |
| 6 | **Check dependencies** | Does this action require a package/runtime that might not be installed? Verify first |
| 7 | **Convention check** | Does this action match existing code style and patterns in the project? Look at neighboring files |

#### Phase 3 — Post-step verification (after EVERY action)

| # | Check | What to verify |
|---|---|---|
| 1 | **Command succeeded** | Check exit code. If it failed, log the error in the Mistakes Registry |
| 2 | **Output matches expectation** | Did the command produce what you expected? If not, investigate before proceeding |
| 3 | **File state is correct** | Re-read the modified file to confirm the edit was applied correctly |
| 4 | **No regressions** | Run tests/lint/typecheck if available |
| 5 | **Log the step** | Update the session log with what was done and the result |
| 6 | **Update Mistakes Registry** | If you made a mistake, log it immediately — don't wait

---

## Session Log

### [2026-05-14] Added per-step monitoring protocol

**Goal:** Ensure every single action is checked before execution — no blind steps, no repeated mistakes.

**Tasks completed:**
- Added **Phase 1 (Session Start)** — 5 checks before any work begins
- Added **Phase 2 (Per-Step Check)** — 7 checks run before EVERY individual action
- Added **Phase 3 (Post-Step Verification)** — 6 checks run after EVERY action
- Added **Step Monitoring Log** below — tracks each step's check results for full audit trail
- Added **Monitoring Log rule** to session entry template

**Files modified:**
- `PROJECT_LOG.md` (enhanced)

**Commands run:**
- (none — file editing only)

**Errors encountered:** None

**Key decisions:**
- Three-phase approach (session → pre-step → post-step) covers the full action lifecycle
- Per-step checks prevent mistakes BEFORE they happen (proactive), not after (reactive)
- Phase 2 step 5 (dry-run mental model) is critical — forces the agent to predict output before running
- Monitoring log creates a full audit trail of every step taken

**Outcome / verification:**
- File reviewed end-to-end — all protocols are consistent and actionable

**Notes for agent training:**
- The per-step checks (Phase 2) are the most important — never skip them even for "simple" actions
- If you catch yourself thinking "this is too small to check" — that's exactly when mistakes happen
- Post-step verification is not optional: always re-read files after editing, always check exit codes
- Update the Step Monitoring Log at the bottom of this file for full traceability

---

### [2026-05-14] Enhanced PROJECT_LOG.md with Mistakes Registry

**Goal:** Add a permanent mistakes registry so the agent never repeats errors — log once, prevent forever.

**Tasks completed:**
- Added **Pre-flight check** — mandatory steps agent must take before starting any task
- Added **Mistakes Registry** — a table tracking every mistake with root cause, consequence, fix, and prevention strategy
- Added logging rules for mistakes — honest, actionable, automated-prevention-oriented
- Updated first session entry to reflect this enhancement

**Files modified:**
- `PROJECT_LOG.md` (enhanced)

**Commands run:**
- (none — file editing only)

**Errors encountered:** None

**Key decisions:**
- Mistakes Registry is checked BEFORE every task (proactive, not reactive)
- "How to prevent" column must contain an actionable rule, not vague advice
- Prevention can include automated checks (lint, tests, scripts) — not just manual reminders

**Outcome / verification:**
- File reviewed end-to-end — structure is consistent

**Notes for agent training:**
- The Mistakes Registry is the single most important section for agent improvement
- Every mistake is a permanent lesson — future agents read this table to avoid repeating it
- If an agent reads the registry and still makes a listed mistake, that's a registry quality problem (fix the prevention strategy)

---

### [2026-05-14] Project initialization

**Goal:** Create a project tracking system that doubles as an agent training resource.

**Tasks completed:**
- Created `PROJECT_LOG.md` with structured session entries
- Added Agent Training Guide section explaining how entries improve agent performance

**Files modified:**
- `PROJECT_LOG.md` (new → enhanced)

**Commands run:**
- (none yet — project is empty)

**Errors encountered:** None

**Key decisions:**
- Markdown format chosen for simplicity, version-control friendliness, and direct readability by both humans and LLMs
- Structured fields (Goal, Commands, Errors, Decisions, Verification) chosen over freeform prose to create clear training signal for agents
- Each entry is treated as a **training example** — documenting the full input → action → outcome → reflection cycle

**Outcome / verification:**
- File created and reviewed — ready for next development session

**Notes for agent training:**
- Always start a new session entry with the same structured fields
- The "Errors encountered" + fix is the most valuable training signal — never skip it
- "Commands run" helps future agents reproduce exact steps without guessing shell commands
- Update the Environment section below when tooling changes (new packages, runtimes, etc.)
- If you're unsure how to structure an entry, look at the most recent session entry as a template

---

## Architecture Decisions

| Date | Decision | Rationale | Alternatives considered |
|---|---|---|---|
| 2026-05-14 | Markdown project log | Human+LLM readable, git-friendly, zero tooling | Notion (too heavy), JSON (bad for humans), code comments (scattered) |

## Mistakes Registry

Every mistake the agent makes goes here. **Check this table before every task.** If your task matches a known mistake pattern, follow the prevention strategy.

| # | Date | Mistake | Root cause | Consequence | Fix / Solution | How to prevent next time |
|---|---|---|---|---|---|---|
| — | — | _(no mistakes logged yet)_ | — | — | — | — |

### How to log a mistake

When you make a mistake (wrong command, wrong file, wrong approach, regression):
1. Add a row to the table above
2. Be honest — mistakes are the most valuable training data
3. The "How to prevent" column should contain an **actionable rule** the next agent can follow
4. If possible, add an **automated check** (lint rule, test, script) that catches this mistake in the future

### Examples of what to log

- Running a command from the wrong directory
- Editing the wrong file or wrong section
- Forgetting to verify with tests/lint
- Using the wrong package manager or runtime
- Misunderstanding the project structure
- Introducing a regression that was caught in review

---

## Environment & Tooling

| Component | Value | Notes |
|---|---|---|
| OS | Windows (win32) | |
| Shell | PowerShell 5.1 | |
| Working dir | `E:\Ayatechai\Z-Talk` | |
| Node / npm | _(to be determined)_ | |
| Python | _(to be determined)_ | |
| Package manager | _(to be determined)_ | |

## Step Monitoring Log

Every individual action taken by the agent is logged here with its check results. This creates a full audit trail.

| # | Date | Action | Phase 2 checks passed? | Phase 3 checks passed? | Result | Notes |
|---|---|---|---|---|---|---|
| 1 | 2026-05-14 | Created initial PROJECT_LOG.md | N/A (setup) | N/A (setup) | ✅ Success | First file |
| 2 | 2026-05-14 | Added Mistakes Registry section | Pass: 1-7 | Pass: 1-6 | ✅ Success | Enhancement |
| 3 | 2026-05-14 | Added per-step monitoring protocol | Pass: 1-7 | Pass: 1-6 | ✅ Success | Enhancement |
| 4 | 2026-05-14 | Refined monitoring per user feedback | Pass: 1-7 | Pass: 1-6 | ✅ Success | Final refinement |

### How to log a step

After every action:
1. Add a new row to the table above
2. Record which Phase 2 checks passed/failed
3. Record which Phase 3 checks passed/failed
4. If any check failed, add a row to the Mistakes Registry
5. Be honest about failures — they train the agent

---

## Active Todos

- [ ] _(first real task goes here)_
