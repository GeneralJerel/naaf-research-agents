# Strand: Copilot UI

## Objective
Build a polished copilot interface that demonstrates real-time agent interaction and clear product value.

## Core Features
- Live chat stream with role highlighting
- Suggested prompts for fast demos
- Connection status to backend API
- Action slots for tool triggers (if time permits)

## UX Principles
- Clarity over complexity
- Large typography for demo projection
- Visual hierarchy: intent -> response -> action

## API Contract
- POST `/copilot/message`
  - Request: `{ "prompt": string }`
  - Response: `{ "text": string, "provider": string }`

## Delivery Checklist
- UI ready for stage demo
- Backend stub wired to UI
- One polished demo flow rehearsed
