import {
    espa_storage, espa_logs, permanent_history,
    cleanupOldData, cleanupOldLogs, formatTimestamp,
} from '../utils/iotStorage.js';

import {
    ble_storage, ble_logs, HISTORY,
    cleanupOldBleData, cleanupOldBleLogs, formatBleTimestamp
} from '../utils/bleStorage.js';

import { getCommand, setCommand } from "../utils/commandStorage.js";

// Universal JSON Data Endpoint
const monster = async (req, res) => {
    try {
        let incomingData = null;

        if (req.body && Object.keys(req.body).length) {
            incomingData = req.body;
        } else if (req.headers['content-type'] === 'application/x-www-form-urlencoded' && req.body) {
            incomingData = req.body;
        } else {
            let rawBody = '';
            await new Promise((resolve) => {
                req.on('data', chunk => rawBody += chunk);
                req.on('end', resolve);
            });
            incomingData = { raw_body: rawBody };
        }

        const timestamp = Date.now() / 1000;

        const entry = {
            esp_type: "ESPA",
            timestamp,
            formatted_timestamp: formatTimestamp(timestamp),
            data: incomingData,
        };

        espa_storage.push(entry);
        espa_logs.push(entry);
        permanent_history.push(entry);

        cleanupOldData();
        cleanupOldLogs();

        res.status(200).json({
            status: "success",
            message: "Raw ESPA data stored",
            received: incomingData,
        });
    } catch (err) {
        res.status(400).json({
            status: "error",
            message: `Failed to process data : ${err.message}`,
        });
    }
};

const getEspaData = (req, res) => {
    cleanupOldData();
    res.status(200).json({
        esp_type: "ESPA",
        active_raw_devices: espa_storage.length,
        devices: espa_storage,
    });
};

// Room Tracking
const ble_post = (req, res) => {
    try {
        const devices = req.body;
        if (!Array.isArray(devices)) {
            return res.status(400).json({ error: 'Expected a JSON array' });
        }
        const now = Date.now() / 1000;
        devices.forEach(device => {
            const entry = {
                timestamp: now,
                formatted_timestamp: formatBleTimestamp(now),
                device
            };
            ble_storage.push(entry);
            ble_logs.push(entry);
            HISTORY.push(entry);
        });
        cleanupOldBleData();
        cleanupOldBleLogs();
        res.status(200).json({ status: 'success', received: devices.length });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

const ble_get = (req, res) => {
    cleanupOldBleData();
    res.status(200).json({
        active_devices: ble_storage.length,
        devices: ble_storage.map(e => e.device)
    });
};

const DEVICE_ID_TO_ROOM_FLOOR_7 = {
    device1: "room_a", device2: "room_b", device3: "room_c", device4: "room_d"
};

const DEVICE_ID_TO_ROOM_FLOOR_8 = {
    device5: "room_l", device6: "room_m", device7: "room_n", device8: "room_o"
};

function aggregateRoomData(storage, deviceMap) {
    // find best RSSI for each MAC, then assign to room by ESP id
    const best = {};
    storage.forEach(entry => {
        const { id, addr, rssi, name } = entry.device;
        if (!id || !addr || rssi === undefined) return;
        if (!best[addr] || rssi > best[addr].rssi) {
            best[addr] = { addr, id, rssi, name };
        }
    });
    // group by room
    const rooms = {};
    Object.values(deviceMap).forEach(r => rooms[r] = []);
    Object.values(best).forEach(device => {
        const room = deviceMap[device.id];
        if (room) rooms[room].push(device);
    });
    return rooms;
}

const getRoomDeviceDataFloor7 = (req, res) => {
    cleanupOldBleData();
    res.status(200).json(aggregateRoomData(ble_storage, DEVICE_ID_TO_ROOM_FLOOR_7));
};

const getRoomDeviceDataFloor8 = (req, res) => {
    cleanupOldBleData();
    res.status(200).json(aggregateRoomData(ble_storage, DEVICE_ID_TO_ROOM_FLOOR_8));
};

// Anchor Restart Command
const getCommandHandler = (req, res) => {
    const anchor = req.query.anchor || "";
    const command = getCommand(anchor);
    res.status(200).send(command);
};

const setCommandHandler = (req, res) => {
    const anchorId = req.params.anchor_id;
    const command = req.body.command;
    if (typeof command !== "string" || !anchorId) {
        return res.status(400).json({ status: "error", message: "Invalid input" });
    }
    setCommand(anchorId, command);
    res.status(200).json({ status: "command set" });
};

export {
    monster, getEspaData, ble_post, ble_get,
    getRoomDeviceDataFloor7, getRoomDeviceDataFloor8,
    getCommandHandler, setCommandHandler
};