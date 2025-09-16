// src/utils/iotStorage.js

const espa_storage = [];
const espa_logs = [];
const permanent_history = [];
const TIME_LIMIT = 90;

function cleanupOldData() {
  const now = Date.now() / 1000;
  for (let i = espa_storage.length - 1; i >= 0; i--) {
    if (now - (espa_storage[i].timestamp || 0) >= TIME_LIMIT) {
      espa_storage.splice(i, 1);
    }
  }
}

function cleanupOldLogs() {
  const now = Date.now() / 1000;
  for (let i = espa_logs.length - 1; i >= 0; i--) {
    const log = espa_logs[i];
    if (now - (log.timestamp || 0) >= TIME_LIMIT) {
      espa_logs.splice(i, 1);
    }
  }
}

function formatTimestamp(ts) {
  return new Date(ts * 1000).toISOString().replace('T', ' ').substring(0, 19);
}

export {
  espa_storage,
  espa_logs,
  permanent_history,
  TIME_LIMIT,
  cleanupOldData,
  cleanupOldLogs,
  formatTimestamp,
};
