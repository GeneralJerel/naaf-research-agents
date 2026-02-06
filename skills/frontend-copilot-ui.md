# Skill: Copilot UI

## Goal
Build a fast, clean copilot chat surface that makes demos feel product-grade.

## Checklist
- Clarify the primary user intent (customer support, research, product planning, etc.).
- Add a hero section with a crisp promise and a single primary CTA.
- Provide a chat stream with role tagging and visual hierarchy.
- Include an action bar with 2-3 suggested prompts.
- Add a status signal for the API connection.

## Interaction Pattern
- User message -> POST to `/copilot/message` -> render assistant reply
- Always show a fallback state if the API is down

## Suggested Copy
- "Ask your copilot for UI copy, roadmap ideas, or a product flow."
- "Live Copilot" / "Message Stream"

## Demo Polish
- Show a short example prompt prefilled.
- Keep the color palette bold and readable.
- Keep typography large enough for stage projection.
