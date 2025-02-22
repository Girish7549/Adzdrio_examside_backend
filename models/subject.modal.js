import db from '../db/db.js';  // Assuming you're using a database connection module

// Create a new subject
export const createSubject = async (subjectName, subcategoryId, description, status) => {
  try {
    const query = "INSERT INTO subject (subject_name, subcategory_id, description, status) VALUES (?, ?, ?, ?)";
    const [result] = await db.query(query, [subjectName, subcategoryId, description, status]);
    return result;
  } catch (error) {
    throw new Error(`Database error: ${error.message}`);
  }
};

// Get all subjects
export const getAllSubjects = async () => {
  try {
    const query = "SELECT * FROM subject";
    const [subjects] = await db.query(query);
    return subjects;
  } catch (error) {
    throw new Error(`Database error: ${error.message}`);
  }
};

// Get subject by ID
export const getSubjectById = async (subjectId) => {
  try {
    const query = "SELECT * FROM subject WHERE subject_id = ?";
    const [result] = await db.query(query, [subjectId]);
    return result[0];  // Return the first result (only one subject per ID)
  } catch (error) {
    throw new Error(`Database error: ${error.message}`);
  }
};

// Update subject
export const updateSubjectById = async (subjectId, subjectName, description, status) => {
  try {
    const query = "UPDATE subject SET subject_name = ?, description = ?, status = ? WHERE subject_id = ?";
    const [result] = await db.query(query, [subjectName, description, status, subjectId]);
    return result;
  } catch (error) {
    throw new Error(`Database error: ${error.message}`);
  }
};

// Delete subject by ID
export const deleteSubjectById = async (subjectId) => {
  try {
    const query = "DELETE FROM subject WHERE subject_id = ?";
    const [result] = await db.query(query, [subjectId]);
    return result;
  } catch (error) {
    throw new Error(`Database error: ${error.message}`);
  }
};


export const getSubjectUnitChapterModal = async () => {
  try {
    const query = `
      SELECT s.subject_id, s.subject_name, u.unit_id, u.unit_name, c.chapter_id, c.chapter_name, c.year, c.total, c.avg, c.weightage_first, c.weightage_second
      FROM subject s
      JOIN unit u ON u.subject_id = s.subject_id
      JOIN chapter c ON c.unit_id = u.unit_id
      ORDER BY s.subject_name, u.unit_name, c.chapter_name;
    `;

    // Execute the query
    const [results] = await db.query(query);
    
    // Initialize the structure to store subject, unit, and chapter data
    const subjects = {};

    // Loop through the query results and build the object structure
    results.forEach(row => {
      if (!subjects[row.subject_id]) {
        subjects[row.subject_id] = {
          subject_name: row.subject_name,
          units: {}
        };
      }

      if (!subjects[row.subject_id].units[row.unit_id]) {
        subjects[row.subject_id].units[row.unit_id] = {
          unit_name: row.unit_name,
          chapters: []
        };
      }

      subjects[row.subject_id].units[row.unit_id].chapters.push({
        chapter_id: row.chapter_id,
        chapter_name: row.chapter_name,
        year: row.year,
        total: row.total,
        avg: row.avg,
        weightage_first: row.weightage_first,
        weightage_second: row.weightage_second
      });
    });

    return Object.values(subjects); // Return the structured data

  } catch (err) {
    console.error('Error in getSubjectUnitChapterModal:', err); // Log the error with a descriptive message
    throw new Error('Error in fetching subject-unit-chapter data'); // Rethrow the error for the controller to handle
  }
};




