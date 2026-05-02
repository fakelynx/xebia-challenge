'use strict';
// Deletes ELECTRON_RUN_AS_NODE before spawning Cypress so that VS Code /
// Claude Code terminals (which are Electron apps and set this var) don't
// cause the bundled Electron binary to boot in raw Node mode.
delete process.env.ELECTRON_RUN_AS_NODE;

const path = require('path');
const { spawnSync } = require('child_process');

const cypress = path.join(__dirname, '..', 'node_modules', '.bin', 'cypress');
const [, , ...args] = process.argv;

const result = spawnSync(cypress, args, { stdio: 'inherit', env: process.env, shell: true });
process.exit(result.status ?? 0);
