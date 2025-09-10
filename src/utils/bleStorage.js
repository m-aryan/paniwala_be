// src/utils/bleStorage.js

const ble_storage = [];
const ble_logs = [];
const HISTORY = [];
const DATA_RETENTION_SECONDS = 120;

function cleanupOldBleData() {
  const now = Date.now() / 1000;
  for (let i = ble_storage.length - 1; i >= 0; i--) {
    if (now - (ble_storage[i].timestamp || 0) >= DATA_RETENTION_SECONDS) {
      ble_storage.splice(i, 1);
    }
  }
}

function cleanupOldBleLogs() {
  const now = Date.now() / 1000;
  for (let i = ble_logs.length - 1; i >= 0; i--) {
    if (now - (ble_logs[i].timestamp || 0) >= DATA_RETENTION_SECONDS) {
      ble_logs.splice(i, 1);
    }
  }
}

function formatBleTimestamp(ts) {
  return new Date(ts * 1000).toISOString().replace('T', ' ').substring(0, 19);
}

export {
  ble_storage,
  ble_logs,
  HISTORY,
  DATA_RETENTION_SECONDS,
  cleanupOldBleData,
  cleanupOldBleLogs,
  formatBleTimestamp
};
