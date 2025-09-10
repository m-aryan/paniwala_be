import express from "express";

import {
    monster, getEspaData,
    ble_post, ble_get,
    getRoomDeviceDataFloor7, getRoomDeviceDataFloor8,
    getCommandHandler, setCommandHandler,
} from "../controller/iotController.js";

const iotRouter = express.Router();

iotRouter.post('/monster', monster);
iotRouter.get('/monster', getEspaData);

iotRouter.post('/ble-data', ble_post);
iotRouter.get('/ble-data', ble_get);

iotRouter.get('/room-device-data-floor-7', getRoomDeviceDataFloor7);
iotRouter.get('/room-device-data-floor-8', getRoomDeviceDataFloor8);

iotRouter.post('/command/:anchor_id', setCommandHandler);
iotRouter.get('/command', getCommandHandler);

export default iotRouter;