import db from '../db/db.js'; // Import database connection

// Get all shifts
export const getAllShifts = async () => {
  try {
    const query = 'SELECT * FROM shift';
    const [results] = await db.query(query);
    return results;
  } catch (err) {
    throw new Error('Failed to retrieve shifts');
  }
};

// Get shift by ID
export const getShiftById = async (shiftId) => {
  try {
    const query = 'SELECT * FROM shift WHERE shift_id = ?';
    const [results] = await db.query(query, [shiftId]);
    return results[0]; // Return the first result (or null if not found)
  } catch (err) {
    throw new Error('Failed to retrieve shift');
  }
};

// Create a new shift
export const createShift = async (shift_name, year_id, shift_date_time, status) => {
  try {
    const query = 'INSERT INTO shift (shift_name, year_id, shift_date_time, status) VALUES (?, ?, ?, ?)';
    const [results] = await db.query(query, [shift_name, year_id, shift_date_time, status]);
    return results;
  } catch (err) {
    throw new Error('Failed to create shift');
  }
};

// Update a shift by ID
export const updateShift = async (shiftId, shift_name, year_id, shift_date_time, status) => {
  try {
    const query = 'UPDATE shift SET shift_name = ?, year_id = ?, shift_date_time = ?, status = ? WHERE shift_id = ?';
    const [results] = await db.query(query, [shift_name, year_id, shift_date_time, status, shiftId]);
    return results;
  } catch (err) {
    throw new Error('Failed to update shift');
  }
};

// Delete a shift by ID
export const deleteShift = async (shiftId) => {
  try {
    const query = 'DELETE FROM shift WHERE shift_id = ?';
    const [results] = await db.query(query, [shiftId]);
    return results;
  } catch (err) {
    throw new Error('Failed to delete shift');
  }
};


export const getQuestionsByShiftIdModal = async (shiftId) => {
  try {
    const query = `
      SELECT 
          questions.questions_id,    
          questions.questions_name,
          questions.explanation,
          options.option_id,
          options.option_text,
          options.is_correct
      FROM 
          questions
      LEFT JOIN options ON options.questions_id = questions.questions_id
      WHERE 
          questions.shift_id = ?;
    `;

    const [rows] = await db.query(query, [shiftId]);

    // Format the data
    const formattedData = [];

    rows.forEach((row) => {
      // Find or create the question object in the formattedData array
      let question = formattedData.find(q => q.questions_id === row.questions_id);
      
      if (!question) {
        question = {
          questions_id: row.questions_id,
          question_name: row.questions_name,
          explanation: row.explanation,
          options: []
        };
        formattedData.push(question);
      }

      // Add the option to the question's options array
      question.options.push({
        option_id: row.option_id,
        option_text: row.option_text,
        is_correct: row.is_correct
      });
    });

    return formattedData;

  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};


