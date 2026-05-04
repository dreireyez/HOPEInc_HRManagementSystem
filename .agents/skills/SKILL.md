---
name: graphify
description: "Indexes the codebase into a knowledge graph to reduce token usage and improve context retrieval."
---

# Graphify Skill

## Goal
To optimize the context window for Claude Opus by mapping project dependencies and logic instead of reading raw files.

## Instructions
1. When the user asks to "index," "graphify," or "map" the project, run:
   `python -m graphify index`
2. If the user asks a complex architectural question, refer to the graph state before reading individual files.

## Constraints
- Do not re-index unless the user has made significant file changes.
- Always use the local graph to save on input tokens.