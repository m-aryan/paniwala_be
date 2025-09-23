const resourceQueries = {
    insertResource: `
        INSERT INTO floor_map 
        (img_url, height, width, offsets, area_name, number_of_bubble, offsets_of_bubble_list, company_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    getCompanyIdByName: `
        SELECT id FROM company_topics WHERE company_name = ?
    `,
    getAllResources: `
        SELECT r.id, r.img_url, r.height, r.width, r.offsets, r.area_name, 
               r.number_of_bubble, r.offsets_of_bubble_list, 
               r.company_id, c.company_name
        FROM floor_map r
        JOIN company_topics c ON r.company_id = c.id
    `,
    getResourceById: `
        SELECT r.id, r.img_url, r.height, r.width, r.offsets, r.area_name, 
               r.number_of_bubble, r.offsets_of_bubble_list, 
               r.company_id, c.company_name
        FROM floor_map r
        JOIN company_topics c ON r.company_id = c.id
        WHERE r.id = ?
    `
};

export default resourceQueries;
