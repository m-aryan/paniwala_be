const floorMapQueries = {
// Change insertFloorMap query
insertFloorMap: `
  INSERT INTO floor_map (img_url, height, width, offsets, area_name, company_id)
  VALUES (?, ?, ?, ?, ?, ?)
`,

  insertRTDT: `
    INSERT INTO rtdt (floor_map_id, RTDA_Name, RTDA_X_pos, RTDA_Y_pos, height, width, description)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `,
  insertDeviceBubble: `
    INSERT INTO device_bubbles (floor_map_id, device_bubble_name, device_bubble_x_pos, device_bubble_y_pos, description)
    VALUES (?, ?, ?, ?, ?)
  `,
  insertAccessBlock: `
    INSERT INTO access_block (floor_map_id, access_block_name, access_block_x_pos, access_block_y_pos, access_block_height, access_block_width, description)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `,
  insertZone: `
    INSERT INTO zone_list (floor_map_id, zone_name, zone_x_pos, zone_y_pos, zone_height, zone_width, description)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `,
  insertResource: `
    INSERT INTO resource (floor_map_id, resource_name, resource_type, resource_x_pos, resource_y_pos, description)
    VALUES (?, ?, ?, ?, ?, ?)
  `,
  insertFloor: `
  INSERT INTO floor (floor_id, floor_name, floor_number)
  VALUES (?, ?, ?)
`,
   getFloorMapsByCompany: `
    SELECT * FROM floor_map WHERE company_id = ?
  `,
  getRTDTByFloorMap: `
    SELECT * FROM RTDT WHERE floor_map_id = ?
  `,
  getDeviceBubblesByFloorMap: `
    SELECT * FROM device_bubbles WHERE floor_map_id = ?
  `,
  getAccessBlocksByFloorMap: `
    SELECT * FROM Access_block WHERE floor_map_id = ?
  `,
  getZonesByFloorMap: `
    SELECT * FROM zone_list WHERE floor_map_id = ?
  `,
  getResourcesByFloorMap: `
    SELECT * FROM resource WHERE floor_map_id = ?
  `
,
getFloorMapsByCompany: `
  SELECT * FROM floor_map WHERE company_id = ?
`,

getFloorsByFloorMap: `
  SELECT * FROM floor WHERE floor_id = ?
`,



  
};

export default floorMapQueries;
