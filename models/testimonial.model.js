import db from '../db/db.js';

export const createTestimonialModel = async (testimonialData) => {
  try {
    const query = `INSERT INTO testimonials (message, name, city, title, testimonial_pic) VALUES (?, ?, ?, ?, ?)`;
    const values = [testimonialData.message, testimonialData.name, testimonialData.city, testimonialData.title, testimonialData.testimonialPic];

    const [result] = await db.query(query, values);
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};


export const getAllTestimonialsModel = async () => {
  try {
    const query = `SELECT message,name,testimonial_pic,city,title,testimonial_id FROM testimonials ORDER BY created_at DESC`;
    const [results] = await db.query(query);
    return results;
  } catch (err) {
    throw new Error(err.message);
  }
};


export const getTestimonialByIdModel = async (testimonialId) => {
  try {
    const query = `SELECT * FROM testimonials WHERE testimonial_id = ?`;
    const [result] = await db.query(query, [testimonialId]);
    return result[0];
  } catch (err) {
    throw new Error(err.message);
  }
};


export const updateTestimonialModel = async (testimonialId, testimonialData) => {
  try {
    const query = `UPDATE testimonials SET message = ?, name = ?, title = ?, testimonial_pic = ? WHERE testimonial_id = ?`;
    const values = [testimonialData.message, testimonialData.name, testimonialData.title, testimonialData.testimonialPic, testimonialId];
    const [result] = await db.query(query, values);
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};


export const deleteTestimonialModel = async (testimonialId) => {
  try {
    const query = `DELETE FROM testimonials WHERE testimonial_id = ?`;
    const [result] = await db.query(query, [testimonialId]);
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};
