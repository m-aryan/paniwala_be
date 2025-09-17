const enquiryQueries = {
    generateEnquiry: `
        INSERT INTO enquiries (first_name, last_name, email, organization, project_type, project_details, newsletter) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `
}

export default enquiryQueries;