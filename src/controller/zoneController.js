import pool from "../config/db.js";
import zoneQueries from "../queries/zoneQueries.js";

// Insert Zone
export const addZone = async (req, res) => {
  try {
    const { floor_map_id, zone_name, offsets, description } = req.body;

    if (!floor_map_id || !zone_name) {
      return res.status(400).json({ error: "floor_map_id and zone_name are required" });
    }

    const [result] = await pool.query(zoneQueries.insertZone, [
      floor_map_id,
      zone_name,
      offsets || null,
      description || null
    ]);

    res.status(201).json({ message: "Zone added successfully", zoneId: result.insertId });
  } catch (error) {
    console.error("Error inserting zone:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all Zones (with floor_map mapping)
export const getZones = async (req, res) => {
  try {
    const [rows] = await pool.query(zoneQueries.getZones);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching zones:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get Zone by ID
export const getZoneById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(zoneQueries.getZoneById, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Zone not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching zone:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
