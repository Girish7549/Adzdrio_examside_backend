import db from '../db/db.js';

export const createKumbModel = async (firstName, middleName, lastName, email, phone, objective) => {
    try {
        const query = `
            INSERT INTO kumbs (first_name, middle_name, last_name, email, phone, objective)
            VALUES (?, ?, ?, ?, ?, ?) RETURNING *
        `;

        const [result] =  await db.query(query, [firstName, middleName, lastName, email, phone, objective]);

        return result.length === 0 ? null : result;
        
    } catch (error) {
        console.error('Kumb Model Error:', error);
        throw new Error(`Kumbh Model DB error ${error.message}`);
    }
};

export const getAllKumbModel = async () => {
    try {
        const query = `SELECT * FROM kumbs`;

        const [result] = await db.query(query);

        return result;
        
    } catch (error) {
        console.error('Kumb Model Error:', error);
        throw new Error(`Kumbh Model DB error ${error.message}`);
    }
};

export const getKumbByIdModel = async (kumbId) => {
    try {
        const query = `SELECT * FROM kumbs WHERE kumb_id = ?`;

        const [result] = await db.query(query, [kumbId]);

        if (result.length === 0) {
            return null;
        }

        return result[0];
        
    } catch (error) {
        console.error('Kumb Model Error:', error);
        throw new Error(`Kumbh Model DB error ${error.message}`);
    }
};

export const editKumbStatusByIdModel = async (kumbId, status) => {
    try {
        const query =  'UPDATE kumbs SET status = ? WHERE kumb_id = ?';
        const [result] = await db.query(query, [kumbId,status]);
        return result.length === 0 ? null : result;
    } catch (error) {
        console.log('kumb model', error);
        throw new Error("DB Model Error");
    }
}


export const deleteKumbByIdModel = async (kumbId) => {
    try {
        const deleteQuery = `
            DELETE FROM kumbs WHERE kumb_id = ?
        `;

        const [result] = await db.query(deleteQuery, [kumbId]);

        if (result.affectedRows === 0) {
            return { success: false, message: 'Kumb not found!' };
        }

        return { success: true, message: 'Kumb data deleted successfully!' };
        
    } catch (error) {
        console.error('Kumb Model Error:', error);
        throw new Error(`Kumbh Model DB error ${error.message}`);
    }
};
