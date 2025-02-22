import db from "../db/db.js";

export const createSubcategoryModel = async (
    subcategoryName,
    description,
    categoryId,
    subcatText,
    status
) => {
    try {
        const checkCategoryQuery = "SELECT * FROM categories WHERE category_id = ?";
        const [category] = await db.query(checkCategoryQuery, [categoryId]);

        if (!category || category.length === 0) {
            return { error: "Category does not exist" };
        }

        const query =
            "INSERT INTO subcategories (subcategory_name, category_id, status, description, subcategory_text) VALUES (?, ?, ?, ?, ?)";
        const [result] = await db.query(query, [
            subcategoryName,
            categoryId,
            status,
            description,
            subcatText
        ]);

        return result.affectedRows > 0 ? result : { error: "Subcategory creation failed" };
    } catch (error) {
        console.error("SubcategoryModel Model Error:", error);
        throw new Error(`SubcategoryModel Model DB error ${error.message}`);
    }
};



export const getAllSubcategoryModel = async () => {
    try {
        const query = `
            SELECT subcategories.*, categories.category_name
            FROM subcategories
            JOIN categories ON subcategories.category_id = categories.category_id
        `;

        const [result] = await db.query(query);
        return result.length === 0 ? null : result;
    } catch (error) {
        console.error("SubcategoryModel Model Error:", error);
        throw new Error(`SubcategoryModel Model DB error ${error.message}`);
    }
};

export const getSubcategoryByIdModel = async (subcategoryId) => {
    try {
        const query = `SELECT * FROM subcategories WHERE subcategory_id = ?`;

        const [result] = await db.query(query, [subcategoryId]);
        return result.length === 0 ? null : result;
    } catch (error) {
        console.error("SubcategoryModel Model Error:", error);
        throw new Error(`SubcategoryModel Model DB error ${error.message}`);
    }
};

export const editSubcategoryByIdModel = async (
    subcategoryName,
    description,
    status,
    subcatText,
    categoryId
) => {
    try {
        const query =
            "update subcategories set subcategory_name=?,description=?,status=?, subcategory_text=?, category_id=? where subcategory_id=?";
        const [result] = await db.query(query, [
            subcategoryName,
            description,
            status,
            subcatText,
            categoryId,
        ]);
        return result.length === 0 ? null : result;
    } catch (error) {
        console.error("SubcategoryModel Model Error:", error);
        throw new Error(`SubcategoryModel Model DB error ${error.message}`);
    }
};

export const deleteSubcategoryByIdModel = async (subcategoryId) => {
    try {
        const query = "DELETE FROM subcategories WHERE subcategory_id = ?";
        const [result] = await db.query(query, [subcategoryId]);
        return result.length === 0 ? null : result;
    } catch (error) {
        console.error("SubcategoryModel Model Error:", error);
        throw new Error(`SubcategoryModel Model DB error ${error.message}`);
    }
};

export const filterSubcategoryByIdModel = async (categoryId) => {
    try {
        const query = "SELECT * FROM subcategories WHERE category_id = ?";
        const [result] = await db.query(query, [categoryId]);
        return result.length === 0 ? null : result;
    } catch (error) {
        console.error("SubcategoryModel Model Error:", error);
        throw new Error(`SubcategoryModel Model DB error ${error.message}`);
    }
};


// Function to get subcategory data
export const getSubcategoryByIdSub_unit_chapter = async (subcategoryId) => {
    try {
        if (!subcategoryId) {
            throw new Error('Invalid subcategory ID');
        }

        const query = `
      SELECT
  subcategories.subcategory_id,
  subcategories.subcategory_name,
  subject.subject_id,
  subject.subject_name,
  unit.unit_id,
  unit.unit_name,
  chapter.chapter_id,
  chapter.chapter_name,
  chapter.year,
  chapter.total,
  chapter.avg,
  chapter.weightage_first,
  chapter.weightage_second
FROM
  subcategories
  LEFT JOIN subject ON subject.subcategory_id = subcategories.subcategory_id
  LEFT JOIN unit ON unit.subject_id = subject.subject_id
  LEFT JOIN chapter ON chapter.unit_id = unit.unit_id
WHERE
  subcategories.subcategory_id = ?;

    `;

        // Execute the query and get the results
        const [rows] = await db.query(query, [subcategoryId]);

        // If no rows found, return an empty object
        if (rows.length === 0) {
            return { subcategory_id: subcategoryId, subject: [] };
        }

        // Process the results into the desired structure
        const subcategoryData = {
            subcategory_id: subcategoryId,
            subject: [],
        };

        // Populate subjects, units, and chapters
        rows.forEach((row) => {
            // Find subject or create a new one
            const subject = subcategoryData.subject.find(
                (sub) => sub.subject_id === row.subject_id
            );
            if (!subject) {
                subcategoryData.subject.push({
                    subject_id: row.subject_id,
                    subject_name: row.subject_name,
                    unit: [],
                });
            }

            // Find unit for the subject or create a new one
            const unit = subcategoryData.subject
                .find((sub) => sub.subject_id === row.subject_id)
                .unit.find((u) => u.unit_id === row.unit_id);

            if (!unit) {
                subcategoryData.subject
                    .find((sub) => sub.subject_id === row.subject_id)
                    .unit.push({
                        unit_id: row.unit_id,
                        unit_name: row.unit_name,
                        chapter: [],
                    });
            }

            // Push chapter into the correct unit
            subcategoryData.subject
                .find((sub) => sub.subject_id === row.subject_id)
                .unit.find((u) => u.unit_id === row.unit_id)
                .chapter.push({
                    chapter_id: row.chapter_id,
                    chapter_name: row.chapter_name,
                    year: row.year,
                    total: row.total,
                    avg: row.avg,
                    weightage_first: row.weightage_first,
                    weightage_second: row.weightage_second,
                });
        });

        return subcategoryData;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Error('Error fetching data from the database');
    }
};
