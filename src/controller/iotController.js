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

        if (devices.length === 0) {
            return res.status(400).json({ error: 'Array cannot be empty' });
        }

        const validationErrors = [];
        devices.forEach((device, index) => {
            const deviceErrors = [];

            if (typeof device !== 'object' || device === null) {
                validationErrors.push({ device: index, errors: ['Device must be an object'] });
                return;
            }

            if (!device.id || typeof device.id !== 'string' || device.id.trim() === '') {
                deviceErrors.push('id is required and must be a non-empty string');
            }

            if (!device.addr || typeof device.addr !== 'string') {
                deviceErrors.push('addr is required and must be a string');
            } else {
                const macPattern = /^[0-9a-fA-F]{2}:[0-9a-fA-F]{2}:[0-9a-fA-F]{2}:[0-9a-fA-F]{2}:[0-9a-fA-F]{2}:[0-9a-fA-F]{2}$/;
                if (!macPattern.test(device.addr)) {
                    deviceErrors.push('addr must be a valid MAC address format (XX:XX:XX:XX:XX:XX)');
                }
            }

            if (!device.hasOwnProperty('rssi') || typeof device.rssi !== 'number') {
                deviceErrors.push('rssi is required and must be a number');
            } else if (device.rssi > 0 || device.rssi < -100) {
                deviceErrors.push('rssi must be between -100 and 0');
            }

            if (!device.hasOwnProperty('floor') || typeof device.floor !== 'number' || !Number.isInteger(device.floor)) {
                deviceErrors.push('floor is required and must be an integer');
            }

            if (device.hasOwnProperty('name') && typeof device.name !== 'string') {
                deviceErrors.push('name must be a string if provided');
            }

            if (deviceErrors.length > 0) {
                validationErrors.push({ device: index, errors: deviceErrors });
            }
        });

        if (validationErrors.length > 0) {
            return res.status(400).json({
                error: 'Validation failed',
                details: validationErrors
            });
        }

        const now = Date.now() / 1000;
        devices.forEach(device => {
            const cleanDevice = {
                id: device.id,
                addr: device.addr.toLowerCase(),
                rssi: device.rssi,
                floor: device.floor
            };

            if (device.name && device.name.trim() !== '') {
                cleanDevice.name = device.name.trim();
            }

            const entry = {
                timestamp: now,
                formatted_timestamp: formatBleTimestamp(now),
                device: cleanDevice
            };

            ble_storage.push(entry);
            ble_logs.push(entry);
            HISTORY.push(entry);
        });

        cleanupOldBleData();
        cleanupOldBleLogs();

        res.status(200).json({
            status: 'success',
            received: devices.length,
            message: `Successfully processed ${devices.length} device(s)`
        });

    } catch (err) {
        console.error('BLE POST Error:', err);
        res.status(500).json({
            status: 'error',
            message: err.message
        });
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
    device1: "room_a",
    device2: "room_b",
    device3: "room_c",
    device4: "room_d",
    device5: "room_e",
    device6: "room_f",
    device7: "room_g",
    device8: "room_h",
    device9: "room_i",
    device10: "room_j"
};

const DEVICE_ID_TO_ROOM_FLOOR_8 = {
    device11: "room_a1", 
    device12: "room_b1", 
    device13: "room_c1", 
    device14: "room_d1", 
    device15: "room_e1", 
    device16: "room_f1", 
    device17: "room_g1", 
    device18: "room_h1", 
    device19: "room_i1", 
    device20: "room_j1"

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