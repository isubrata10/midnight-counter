const { spawnSync } = require('child_process');

// This uses curl to hit the MCP endpoint if it's HTTP, but wait, the instructions said:
// claude mcp add --transport http midnight-docs https://midnight.mcp.kapa.ai

// I'll just search npm packages to see how the providers are exported in midnight-js.
