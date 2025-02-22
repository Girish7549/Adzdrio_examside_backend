import db from '../db/db.js';

// Function to create a new question
export const createQuestionModal = async (questionsName, shift, topicId, status, difficulty, explanation, chapterId, shiftId) => {
  try {
    const query = 'INSERT INTO questions (questions_name, shift, topic_id, status, difficulty, explanation, chapter_id, shift_id) VALUES (?, ?, ?, ?, ?,?,?, ?)';
    const [result] = await db.query(query, [questionsName, shift, topicId, status, difficulty, explanation, chapterId, shiftId]);
    return result;
  } catch (error) {
    throw new Error('Error while creating question: ' + error.message);
  }
};

// Function to get all questions
export const getAllQuestionsModal = async () => {
  try {
    const query = 'SELECT * FROM questions';
    const [rows] = await db.query(query);
    return rows;
  } catch (error) {
    throw new Error('Error while fetching questions: ' + error.message);
  }
};

// Function to get a question by ID
export const getQuestionByIdModal = async (id) => {
  try {
    const query = 'SELECT * FROM questions WHERE questions_id = ?';
    const [rows] = await db.query(query, [id]);
    if (rows.length === 0) {
      throw new Error('Question not found');
    }
    return rows[0]; // Return the first matching question
  } catch (error) {
    throw new Error('Error while fetching question: ' + error.message);
  }
};

// Function to update a question
export const updateQuestionModal = async (id, questionsName, shift, topicId, status, difficulty, explanation, chapterId) => {
  try {
    const query = 'UPDATE questions SET questions_name = ?, shift = ?, topic_id = ? , status = ?, difficulty = ?, explanation = ?, chapter_id = ? WHERE questions_id = ?';
    const [result] = await db.query(query, [questionsName, shift, topicId, status, difficulty, explanation, chapterId, id]);
    if (result.affectedRows === 0) {
      throw new Error('Question not found for update');
    }
    return result;
  } catch (error) {
    throw new Error('Error while updating question: ' + error.message);
  }
};

// Function to delete a question
export const deleteQuestionModal = async (id) => {
  try {
    const query = 'DELETE FROM questions WHERE questions_id = ?';
    const [result] = await db.query(query, [id]);
    if (result.affectedRows === 0) {
      throw new Error('Question not found for deletion');
    }
    return result;
  } catch (error) {
    throw new Error('Error while deleting question: ' + error.message);
  }
};


// Get all questions with their options
export const getAllQuestionsWithTheirOptionsModal = async () => {
  try {
    const query = `
      SELECT 
        q.questions_id, 
        q.shift,
        q.questions_name, 
        q.difficulty,  
        o.option_id, 
        o.option_text, 
        o.is_correct
      FROM 
        Questions q
      LEFT JOIN 
        options o ON q.questions_id = o.questions_id;
    `;
    const [results] = await db.query(query);

    // Grouping the results by question_id
    const questionsWithOptions = results.reduce((acc, row) => {
      const {
        questions_id,
        shift,
        questions_name,
        difficulty,
        option_id,
        option_text,
        is_correct,
      } = row;

      // Find if the question already exists in the accumulator
      let question = acc.find(q => q.questions_id === questions_id);

      if (!question) {
        // If not, create a new question object
        question = {
          questions_id,
          shift,
          questions_name,
          difficulty,
          options: []
        };
        acc.push(question); // Add the question to the accumulator
      }

      // Add the option to the options array for this question
      if (option_id) {
        question.options.push({
          option_id,
          option_text,
          is_correct
        });
      }

      return acc;
    }, []);

    return questionsWithOptions; // Return the grouped result
  } catch (err) {
    throw new Error('Failed to retrieve questions with options');
  }
};


export const getQuestionsWithOptionsByTopicId = async (topicId) => {
  try {
    // SQL query to fetch questions with their options for a given topic_id
    const query = `
      SELECT 
          q.questions_id, 
          q.questions_name, 
          o.option_id, 
          o.option_text, 
          o.is_correct
      FROM 
          questions q
      JOIN 
          options o ON q.questions_id = o.questions_id
      WHERE 
          q.topic_id = ?
      ORDER BY 
          q.questions_id, o.option_id;
    `;

    const [rows] = await db.execute(query, [topicId]);

    if (rows.length === 0) {
      throw new Error(`No questions found for topic_id: ${topicId}`);
    }

    const formattedData = {};

    rows.forEach(row => {
      const { question_id, question_name, option_id, option_text, is_correct } = row;

      if (!formattedData[question_id]) {
        formattedData[question_id] = {
          question_name,
          options: []
        };
      }

      formattedData[question_id].options.push({
        option_id,
        option_text,
        is_correct
      });
    });

    return formattedData;

  } catch (error) {
    console.error('Error fetching questions and options:', error);
    throw new Error(`An error occurred while fetching questions and options: ${error.message}`);
  }
};




