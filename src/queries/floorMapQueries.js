const floorMapQueries = {
  insertFloorMap: `
    INSERT INTO floor_map (img_url, height, width, offsets, area_name, company_id, floor_number)
    VALUES (?, ?, ?, ?, ?, ?, ?)
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
  `
};

export default floorMapQueries;
