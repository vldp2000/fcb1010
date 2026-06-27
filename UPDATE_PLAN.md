# FCB1010 Modernization Plan

This document tracks the proposed migration from the current combined repository into a maintainable live rig architecture.

## Goals

- Keep the current tested live setup recoverable at all times.
- Split the solution into separate repositories for controller, API, and UI.
- Preserve the Socket.IO notification workflow between all modules.
- Avoid building the Vue UI on the Raspberry Pi.
- Modernize Python, Node/API, and Vue in separate, testable steps.
- Keep song/preset JSON data safe and backward compatible.

## Proposed Repositories

### `fcb1010-controller`

Python MIDI controller running on the Raspberry Pi.

Responsibilities:

- Read direct MIDI messages from the Behringer FCB1010.
- Send MIDI CC/PC messages to the live devices.
- Maintain live runtime state for current PC, volume, Delay, Reverb, Modulation, and Boost.
- Communicate with the API notification hub using Socket.IO.
- Read song data through the API or local JSON files, depending on final deployment choice.
- Own Raspberry Pi service files for running the controller.

Should not contain:

- Vue UI source.
- Node API implementation.
- Historical Revelox/ReveloxMidi logic.

### `fcb1010-api`

Node API and Socket.IO notification hub.

Responsibilities:

- Serve JSON-backed API endpoints for songs, presets, instruments, banks, gigs, and preset usage.
- Own the Socket.IO relay between UI and controller.
- Own the notification/event contract.
- Read/write JSON data under the configured data path.
- Run on the Raspberry Pi or another always-available local host.

Should not contain:

- Vue source/build tooling.
- Python MIDI controller code.

### `fcb1010-ui`

Vue maintenance/live UI.

Responsibilities:

- Provide the maintenance and live-control browser UI.
- Build static production assets outside the Raspberry Pi.
- Deploy only `dist` files to the Raspberry Pi web root when hosted locally.
- Use runtime configuration for API and Socket.IO URLs.

Should not contain:

- Python controller code.
- Node API server code.
- Live data files except for test fixtures.

## Data Repository

Use the existing `fcbdata` repository for live JSON data.

Responsibilities:

- Store songs, presets, instruments, banks, gigs, and scheduled gig data.
- Be backed up independently from application code.
- Keep data changes reviewable and recoverable.

Important rule:

- App migrations must not rewrite all JSON files unless explicitly required and backed up.

## Notification Contract

Before upgrading Socket.IO or splitting repositories, define the event contract in the API repo.

Suggested file:

```text
docs/socket-events.md
```

Current UI-to-controller events:

| Event | Direction | Payload |
| --- | --- | --- |
| `VIEW_SONG_MESSAGE` | UI -> API -> Controller | Song id as number/string |
| `VIEW_PROGRAM_MESSAGE` | UI -> API -> Controller | Program index as number/string |
| `VIEW_EDIT_MODE_MESSAGE` | UI -> API -> Controller | `"0"` for Live mode, otherwise MIDI channel for Config mode |

Current controller-to-UI events:

| Event | Direction | Payload |
| --- | --- | --- |
| `CONTROLLER_PROGRAM_MESSAGE` | Controller -> API -> UI | Program index as string |
| `CONTROLLER_SONG_MESSAGE` | Controller -> API -> UI | Song id as string |
| `CONTROLLER_GIG_MESSAGE` | Controller -> API -> UI | Gig id as string |
| `CONTROLLER_SYNC_MESSAGE` | Controller -> API -> UI | JSON string with `songId`, `programIdx`, `bankId` |
| `CONTROLLER_PRESETVOLUME_MESSAGE` | Controller -> API -> UI | Volume as string |

Reserved/legacy events:

| Event | Notes |
| --- | --- |
| `CONTROLLER_PEDAL1_MESSAGE` | Currently reserved |
| `CONTROLLER_PEDAL2_MESSAGE` | Currently reserved |

Compatibility requirement:

- API, controller, and UI must share the same event names and payload shapes.
- Socket.IO major-version upgrades must be tested across all three modules together.

## Migration Phases

### Phase 0: Freeze Current Working State

- Keep `singlesongselection` as the protected RPi live backup.
- Keep `codex/live-rpi-direct-midi` as the current tested candidate branch.
- Confirm RPi can roll back to `singlesongselection`.
- Confirm `fcbdata` contains the latest known-good live data.

Exit criteria:

- Live backup branch is pushed.
- Current candidate branch is pushed.
- RPi can switch between backup and candidate branches.

### Phase 1: Stabilize Deployment

- Stop building Vue on the Raspberry Pi.
- Build UI on Windows or CI.
- Deploy only static `dist` files to `/var/www/html` or another configured Lighttpd web root.
- Document Lighttpd config and deployment commands.
- Disable or carefully control service-worker caching during active development.

Exit criteria:

- UI deployment can be repeated without rebuilding on RPi.
- Browser shows the expected version after deploy.
- API and controller keep running after UI deploy.

### Phase 2: Extract Notification Contract

- Add `docs/socket-events.md` to the API repo.
- Add API tests that verify Socket.IO event relay registrations.
- Add controller tests for emitted/listened events.
- Add UI tests for emitted/listened events.

Exit criteria:

- Event names and payloads are documented.
- Tests fail if any module silently changes an event name.

### Phase 3: Split Repositories

Create:

- `fcb1010-controller`
- `fcb1010-api`
- `fcb1010-ui`

Move code with history where practical, or start clean repositories with a tagged import from the current monorepo.

Preserve:

- Existing branches/tags in the original repository.
- Current working RPi branch reference.
- Data repository as a separate concern.

Exit criteria:

- Each repo builds/tests independently.
- Each repo has its own README.
- Deployment instructions are clear.

### Phase 4: Modernize API

- Move API to a current Node LTS runtime.
- Upgrade dependencies carefully.
- Keep JSON file API shape stable.
- Keep Socket.IO major version unchanged until controller/UI are ready.
- Add tests around:
  - song read/write
  - id generation
  - preset usage endpoint
  - event relay
  - data path configuration

Exit criteria:

- API runs on the RPi or chosen host.
- `/presetusage/:instrumentId/:midiPc` works.
- Existing UI and controller remain compatible.

### Phase 5: Modernize Python Controller

- Decide target Python version based on Raspberry Pi OS support.
- Keep Python 3.7 compatibility until the RPi runtime is upgraded.
- Avoid syntax that older RPi Python cannot run until migration is complete.
- Add/keep tests for:
  - MIDI pacing
  - expression pedal routing
  - PC skip logic
  - volume reassert
  - Delay/Reverb/Mod/Boost toggles
  - Socket.IO notifications
  - system command two-step confirmation

Exit criteria:

- Controller starts cleanly on RPi.
- Direct MIDI behavior is verified.
- Rollback branch remains available.

### Phase 6: Modernize UI

Recommended path:

- Create a fresh Vue 3 + Vite app.
- Use Vuetify 3/4 only after checking component equivalents.
- Port workflows screen by screen.
- Keep the Vue 2 UI deployed as the fallback until Vue 3 is proven.

Key changes expected:

- Vue 2 `new Vue(...)` -> Vue 3 `createApp(...)`.
- Vue Router 3 -> Vue Router 4.
- Vuex 3 -> Vuex 4 or Pinia.
- Vuetify 2 components/styles -> Vuetify 3/4 equivalents.
- `vue-socket.io-extended` replacement or direct `socket.io-client` wrapper.
- Runtime config for API and Socket.IO URLs.
- Service worker disabled initially or made explicit.

Exit criteria:

- Vue 3 UI can run locally.
- Vue 3 UI can connect to current API and notification hub.
- Live page, preset editing, preset usage, and song save workflows match Vue 2 behavior.
- Static build can be deployed to Lighttpd without RPi build step.

## Runtime Configuration

The UI should not hardcode RPi IP addresses in source.

Preferred approach:

```text
/config.json
```

Example:

```json
{
  "apiUrl": "http://midipi:8081/",
  "messageUrl": "http://midipi:8081/"
}
```

Benefits:

- Same UI build works for home network, iPhone hotspot, and local development.
- No rebuild required when the RPi address changes.
- Separate UI repo can deploy generic static assets.

## Known Risks

- Socket.IO client/server version mismatch.
- Vue service worker serving stale UI bundles.
- RPi2 memory limitations during frontend builds.
- Vuetify migration causing visual/layout regressions.
- Accidental JSON data rewrites.
- SD-card wear from unnecessary writes.
- Losing the proven live branch while testing.

## Immediate Next Steps

1. Document the current Lighttpd web root and deployment process.
2. Move the built UI deployment process out of the RPi build path.
3. Add the Socket.IO event contract document.
4. Create repository split plan with exact target repo names.
5. Decide whether API and notification hub stay together permanently or split later.
6. Modernize API first while keeping Socket.IO compatible.
7. Modernize Python controller second.
8. Start Vue 3 UI as a separate candidate, keeping Vue 2 deployed as fallback.

