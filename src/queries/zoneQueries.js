const zoneQueries = {
  insertZone: `
    INSERT INTO zone_list (floor_map_id, zone_name, offsets, description)
    VALUES (?, ?, ?, ?)
  `,
getZones: `
  SELECT z.id, z.zone_name, z.offsets, z.description, z.floor_map_id
  FROM zone_list z
`,

getZoneById: `
  SELECT z.id, z.zone_name, z.offsets, z.description, z.floor_map_id
  FROM zone_list z
  WHERE z.id = ?
`

};

export default zoneQueries;
