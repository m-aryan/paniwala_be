import pool from "../config/db.js";
import floorMapQueries from "../queries/floorMapQueries.js";

// Insert floor map and related tables
export const addFloorMapAllTables = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // File from frontend (using upload.fields)
    const file = req.files && req.files['floor_map_image'] ? req.files['floor_map_image'][0] : null;

    if (!file) {
      return res.status(400).json({ error: "Floor map image file is required" });
    }

    const img_url = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
    console.log("Generated img_url:", img_url);

    // Parse JSON fields from FormData
    const f = JSON.parse(req.body.floor_map);
    const rtdtArr = JSON.parse(req.body.rtdt || "[]");
    const deviceBubblesArr = JSON.parse(req.body.device_bubbles || "[]");
    const accessBlocksArr = JSON.parse(req.body.access_blocks || "[]");
    const zonesArr = JSON.parse(req.body.zones || "[]");
    const resourcesArr = JSON.parse(req.body.resources || "[]");

    // 1️⃣ Insert into floor_map
    // const [floorMapResult] = await connection.execute(floorMapQueries.insertFloorMap, [
    //   img_url, f.height, f.width, f.offsets, f.area_name, f.company_id, f.floor_number
    // ]);
    // const floorMapId = floorMapResult.insertId;

    // Insert into floor_map
    const [floorMapResult] = await connection.execute(floorMapQueries.insertFloorMap, [
      img_url, f.height, f.width, f.offsets, f.area_name, f.company_id
    ]);

    const floorMapId = floorMapResult.insertId;

    // 1. Insert into floor
    await connection.execute(floorMapQueries.insertFloor, [
      floorMapId, f.floor_name, f.floor_number
    ]);


    // Insert RTDT
    for (const r of rtdtArr) {
      await connection.execute(floorMapQueries.insertRTDT, [
        floorMapId, r.RTDA_Name, r.RTDA_X_pos, r.RTDA_Y_pos, r.height, r.width, r.description
      ]);
    }

    // Insert device bubbles
    for (const b of deviceBubblesArr) {
      await connection.execute(floorMapQueries.insertDeviceBubble, [
        floorMapId, b.device_bubble_name, b.device_bubble_x_pos, b.device_bubble_y_pos, b.description
      ]);
    }

    // Insert access blocks
    for (const a of accessBlocksArr) {
      await connection.execute(floorMapQueries.insertAccessBlock, [
        floorMapId, a.access_block_name, a.access_block_x_pos, a.access_block_y_pos, a.access_block_height, a.access_block_width, a.description
      ]);
    }

    // Insert zones
    for (const z of zonesArr) {
      await connection.execute(floorMapQueries.insertZone, [
        floorMapId, z.zone_name, z.zone_x_pos, z.zone_y_pos, z.zone_height, z.zone_width, z.description
      ]);
    }

    // Insert resources
    for (const r of resourcesArr) {
      await connection.execute(floorMapQueries.insertResource, [
        floorMapId, r.resource_name, r.resource_type, r.resource_x_pos, r.resource_y_pos, r.description
      ]);
    }

    await connection.commit();

    res.status(201).json({
      message: "Floor map and all related data inserted successfully",
      floorMapId,
      img_url,
      file_info: {
        originalname: file.originalname,
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size
      }
    });

  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ error: "Internal server error", message: err.message });
  } finally {
    connection.release();
  }
};

export const getFloorMapsByCompany = async (req, res) => {
  const companyId = req.user.company_id; // from JWT
  console.log("id=", companyId);

  try {
    const connection = await pool.getConnection();

    // Get all floor maps for this company
    const [floorMaps] = await connection.query(
      floorMapQueries.getFloorMapsByCompany,
      [companyId]
    );

    // For each floor map, fetch its related tables
    for (let floorMap of floorMaps) {
      const [rtdt] = await connection.query(floorMapQueries.getRTDTByFloorMap, [floorMap.id]);
      const [deviceBubbles] = await connection.query(floorMapQueries.getDeviceBubblesByFloorMap, [floorMap.id]);
      const [accessBlocks] = await connection.query(floorMapQueries.getAccessBlocksByFloorMap, [floorMap.id]);
      const [zones] = await connection.query(floorMapQueries.getZonesByFloorMap, [floorMap.id]);
      const [resources] = await connection.query(floorMapQueries.getResourcesByFloorMap, [floorMap.id]);

      // New: Get floor info
      const [floors] = await connection.query(floorMapQueries.getFloorsByFloorMap, [floorMap.id]);

      floorMap.rtdt = rtdt;
      floorMap.device_bubbles = deviceBubbles;
      floorMap.access_blocks = accessBlocks;
      floorMap.zones = zones;
      floorMap.resources = resources;
      floorMap.floors = floors;
    }

    connection.release();

    return res.status(200).json({
      message: "Floor maps retrieved successfully",
      company_id: companyId,
      count: floorMaps.length,
      data: floorMaps
    });

  } catch (err) {
    console.error("Error fetching floor maps:", err);
    res.status(500).json({ error: "Internal server error", message: err.message });
  }
};
