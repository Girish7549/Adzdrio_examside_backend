import db from '../db/db.js'; // Assuming you have a DB connection setup

// Create Unit
export const createUnitModel = async (unitName, subjectId, description, status) => {
  try {
    const query =
      "INSERT INTO unit (unit_name, subject_id, description, status) VALUES (?, ?, ?, ?)";
    const [result] = await db.query(query, [unitName, subjectId, description, status]);
    return result;
  } catch (error) {
    throw new Error(`Error creating unit: ${error.message}`);
  }
};

// Get Unit by ID
export const getUnitByIdModel = async (unitId) => {
  try {
    const query = "SELECT * FROM unit WHERE unit_id = ?";
    const [unit] = await db.query(query, [unitId]);
    return unit.length > 0 ? unit[0] : null; // Return the unit or null if not found
  } catch (error) {
    throw new Error(`Error fetching unit: ${error.message}`);
  }
};

// Get All Units
export const getAllUnitsModel = async () => {
  try {
    const query = "SELECT * FROM unit";
    const [units] = await db.query(query);
    return units;
  } catch (error) {
    throw new Error(`Error fetching all units: ${error.message}`);
  }
};

// Update Unit
export const updateUnitModel = async (unitId, unitName, description, status) => {
  try {
    const query =
      "UPDATE unit SET unit_name = ?, description = ?, status = ?, updated_date = CURRENT_TIMESTAMP WHERE unit_id = ?";
    const [result] = await db.query(query, [unitName, description, status, unitId]);
    return result.affectedRows > 0;
  } catch (error) {
    throw new Error(`Error updating unit: ${error.message}`);
  }
};

// Delete Unit
export const deleteUnitByIdModel = async (unitId) => {
  try {
    const query = "DELETE FROM unit WHERE unit_id = ?";
    const [result] = await db.query(query, [unitId]);
    return result.affectedRows > 0;
  } catch (error) {
    throw new Error(`Error deleting unit: ${error.message}`);
  }
};
