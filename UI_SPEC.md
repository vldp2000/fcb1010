# Midi Gig Manager UI Specification

This document describes the current UI design, the workflow it supports, and the desired direction for a future Vue 3 implementation.

## Purpose

The UI is a live/practice control surface for the VGMates guitar rig.

It must support two different modes of thinking:

- Live performance: fast scanning, confidence, and minimal accidental editing.
- Maintenance/configuration: editing songs, presets, volumes, effect flags, and checking preset usage.

The current Vue 2 UI already proves the workflow. The Vue 3 version should preserve that workflow while making the interface calmer, clearer, and easier to deploy.

## Current UI Character

The current UI is a dense working-musician tool.

It shows many live-relevant values at once:

- selected gig
- selected song
- current song program
- four device targets
- preset names
- volume
- pan
- effect flags
- maintenance edit controls

This density is useful. The app is not a marketing site or a casual dashboard. It is an operational surface for rehearsals and live playing.

## What Works Well Today

- The UI mirrors the real rig:
  - BiasFX on iPad
  - SampleTank on iPad
  - BiasFX on MacBook
  - Alchemy on MacBook
- All four app targets are visible at the same time.
- Current gig and song are visible at the top.
- Current program selection is visible.
- Volume and pan are visually represented with knobs.
- Preset names are visible for every app target.
- The user can see configured Delay, Reverb, Modulation, and Boost-style state in context.
- It is practical on a laptop/tablet placed near the live rig.

## Current Design Problems

- The live screen mixes performance information and editing controls too heavily.
- Many controls are small and visually noisy.
- Checkboxes and input fields appear even when the user mostly needs status.
- Live mode and edit/config mode are not visually distinct enough.
- Labels such as `Mute`, `Mode`, `Del`, and `Rev` are small and can be ambiguous.
- It is not always obvious what is active now versus what is only configured in the song preset.
- The current song/program could have stronger visual hierarchy.
- Contrast can be improved; the dark transparent panel style makes some details harder to read.
- Browser caching/service-worker behavior can make it unclear which UI version is currently deployed.
- Building the UI on Raspberry Pi 2 is not practical because production build can run out of memory.

## Design Principles For Vue 3 Rewrite

### Performance State First

The first screen in live mode should prioritize:

- What song is selected?
- What program is active?
- What presets are loaded?
- What volumes are active?
- Which effects are active?
- Are the API and controller connected?

Editing controls should not compete with those answers.

### Clear Separation Between Live And Maintenance

Live mode should feel like a performance dashboard.

Maintenance mode should expose editing controls.

Config mode should make volume-tuning state explicit, especially when expression pedals are being used to set the best volume.

### Preserve Rig Mental Model

The UI should still represent the four device targets clearly:

- BiasFX iPad
- SampleTank iPad
- BiasFX MacBook
- Alchemy MacBook

The iPad BiasFX target should remain visually primary because it is the main guitar sound. The MacBook BiasFX target can be shown as a secondary/beautifier layer.

### Reduce Clutter Without Hiding Important State

The UI should show all important live state, but hide maintenance-only controls until needed.

Examples:

- Show effect status as compact status chips in live mode.
- Show checkboxes only in edit mode.
- Show numeric/text inputs only in edit mode.
- Keep preset names and volumes visible in live mode.

### Favor Stage-Safe Visuals

Stage-safe means:

- high contrast
- large enough type
- stable layout
- no accidental tiny tap targets for live actions
- obvious active/inactive states
- minimal ambiguity

## Proposed Live Screen Layout

### Top Bar

The top bar should show:

- app name
- API connection status
- controller/socket connection status
- current mode: Live, Config, or Maintenance
- optional deploy/build version

Connection states should be compact and always visible.

### Gig/Song Header

The header should show:

- selected gig
- selected song
- current program name/letter
- current FCB1010 pedal mapping if useful

The selected song and active program should have strong visual hierarchy.

### Program Selector

Programs A, B, C, and D should be visible as large selectable controls.

Each program should show:

- program letter
- optional program title
- active/inactive state

The currently active program should be obvious from a distance.

### Device Lanes

Use four clear lanes/cards/rows:

1. BiasFX iPad
2. SampleTank iPad
3. BiasFX MacBook
4. Alchemy MacBook

Each lane should show:

- device name
- preset name
- actual app PC value
- volume
- pan if still needed
- mute/silent state if volume is 0
- effect states where relevant

BiasFX lanes should show:

- Delay
- Reverb
- Modulation
- Boost

Keyboard lanes should not show guitar-only live effect controls unless future behavior requires it.

### Effect Status Display

For BiasFX:

- `D` for Delay
- `R` for Reverb
- `M` for Modulation
- `B` for Boost

Suggested states:

- active: filled/high-contrast chip
- inactive: muted/outlined chip
- unavailable: hidden or disabled

The UI should distinguish saved song-program state from temporary live override when useful.

## Proposed Maintenance/Edit Behavior

Editing should be explicit.

When edit mode is active for a preset/device lane:

- preset selector becomes available
- volume control becomes editable
- pan control becomes editable if still retained
- Delay/Reverb/Mod/Boost checkboxes become editable
- preset usage lookup is available

When edit mode is not active:

- controls should look like status, not editable form elements
- accidental edits should be difficult

## Preset Selection Dialog

The preset selection dialog should include:

- preset dropdown
- actual app preset display
- instrument/application name
- MIDI PC value
- buttons:
  - Cancel
  - Used In
  - OK

The `Used In` action should call the API preset usage endpoint.

Preset usage should be based primarily on:

- instrument/application
- MIDI PC value

Preset display name is secondary because the actual app preset identity is the important musical link.

## Boost Workflow

Boost should be represented as a normal saved song-program flag:

- field name: `boostflag`
- default: `false`/`0`
- old data without `boostflag` is treated as `false`

Live behavior:

- BiasFX presets should save Boost/Special block OFF by default.
- When a song program is selected, controller mutes volume, applies required effect toggles, then restores volume.
- If `boostflag` is true, controller sends CC 23 where required.
- Pedal 9 remains a live Boost override.

UI behavior:

- The old `Mute` label should not be used for the active Boost workflow.
- `muteflag` can remain as legacy data but should not be emphasized.

## Runtime Configuration

The Vue 3 UI should not hardcode the Raspberry Pi IP address.

Use a runtime config file:

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

This allows the same UI build to work across:

- home router
- iPhone hotspot
- local development
- future hosted/deployed scenarios

## Deployment Requirements

- UI source should not be required on the Raspberry Pi.
- UI should be built on Windows or CI.
- Only static `dist` files should be deployed to the Raspberry Pi web root.
- Raspberry Pi should serve static files through Lighttpd or another simple web server.
- Service worker should be disabled initially or made very explicit to avoid stale live UI.

## Suggested Vue 3 Stack

Candidate stack:

- Vue 3
- Vite
- Vue Router 4
- Pinia
- Vuetify 3/4 or another component library after evaluation
- direct `socket.io-client` wrapper
- runtime `config.json`

Avoid initially:

- service worker/PWA caching
- complex offline behavior
- building on Raspberry Pi

## Rewrite Strategy

Recommended approach:

1. Keep Vue 2 UI as the working fallback.
2. Write detailed behavior specs from the current UI.
3. Build Vue 3 app from scratch.
4. Port one workflow at a time:
   - live gig control
   - preset selection
   - preset usage
   - song editing
   - preset/instrument/bank maintenance
   - gig scheduling
5. Verify each workflow against current API and controller.
6. Deploy static build to Lighttpd for real RPi testing.

## Acceptance Criteria

The Vue 3 UI is acceptable when:

- live screen shows the same song/program/device state as Vue 2
- selecting song/program works through Socket.IO
- Config mode volume tuning works
- preset selection works
- preset usage lookup works
- song save/update does not duplicate songs
- Boost/Delay/Reverb/Mod flags save correctly
- UI uses runtime API/message URLs
- static build deploys to RPi without building on RPi
- old Vue 2 UI can still be restored if needed

