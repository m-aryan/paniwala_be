// src/utils/commandStorage.js

const pendingCommands = new Map();
const COMMAND_TTL_SECONDS = 60;

function getCommand(anchor) {
    const record = pendingCommands.get(anchor);
    if (!record) return "";
    const now = Date.now() / 1000;
    if (now - record.timestamp >= COMMAND_TTL_SECONDS) {
        pendingCommands.delete(anchor);
        return "";
    }
    pendingCommands.delete(anchor);
    return record.command;
}

function setCommand(anchor, command) {
    const now = Date.now() / 1000;
    pendingCommands.set(anchor, { command, timestamp: now });
}

setInterval(() => {
    const now = Date.now() / 1000;
    for (const [anchor, record] of pendingCommands) {
        if (now - record.timestamp >= COMMAND_TTL_SECONDS) {
            pendingCommands.delete(anchor);
        }
    }
}, COMMAND_TTL_SECONDS * 1000);

export { pendingCommands, getCommand, setCommand };
