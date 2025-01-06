import db from "../db/db.js";

export const createOrderModel = async (
  products,
  totalPrice,
  cupon,
  orderStatus,
  quantity,
  payment,
  userId,
  deliveryDate,
  deliveryTimeSlot,
  address_id,
  payment_mode,
  pointsUsed,
  shipping_cost
) => {
  try {
    const query =
      "INSERT INTO orders (product, total_price, cupon, order_status, payment, quantity, user_id, delivery_date, delivery_time_slot, address_id, payment_mode, points_used, shipping_cost) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";

    // Perform the query and get the result
    const [result] = await db.query(query, [
      products,
      totalPrice,
      cupon,
      orderStatus,
      payment,
      quantity,
      userId,
      deliveryDate,
      deliveryTimeSlot,
      address_id,
      payment_mode,
      pointsUsed,
      shipping_cost
    ]);

    // Ensure the insertId is returned
    if (!result || result.affectedRows === 0) {
      return null;
    }

    // Return the insertId
    return { insertId: result.insertId };
  } catch (error) {
    console.log("OrderModel Error", error);
    return { error: "Database error" };
  }
};

export const getAllOrderModel = async () => {
  try {
    const query = `
            SELECT 
                orders.*,
                addresses.*
            FROM 
                orders
            INNER JOIN addresses ON orders.address_id = addresses.address_id
        `;
    const [results] = await db.query(query);
    return results.length === 0 ? null : results;
  } catch (error) {
    console.error("orders Model Error:", error);
    throw new Error(`orders Model DB error ${error.message}`);
  }
};

export const getOrderByIdModel = async (orderId) => {
  try {
    const query = `
      SELECT 
        orders.order_id,
        orders.total_price,
        orders.order_status,
        orders.quantity AS total_quantity,
        orders.created_at,
        orders.updated_at,
        orders.payment_mode,
        orders.product AS product_json, -- Assuming 'product' column holds the JSON string
        users.first_name AS first_name,
        users.last_name AS last_name,
        users.phone AS user_phone,
        addresses.address_type,
        addresses.flat,
        addresses.floor,
        addresses.area,
        addresses.landmark,
        addresses.state,
        addresses.postal_code,
        addresses.phone AS address_phone
      FROM 
        orders
      INNER JOIN users ON orders.user_id = users.id
      INNER JOIN addresses ON orders.address_id = addresses.address_id
      WHERE orders.order_id = ?
    `;

    const [results] = await db.query(query, [orderId]);

    // Return result as object
    if (results.length === 0) {
      return null;
    }

    // Parse product_json field from JSON string to object
    const result = results[0];
    if (result.product_json) {
      result.products = JSON.parse(result.product_json); // Parse the JSON string into an object
      delete result.product_json; // Clean up to remove raw JSON string
    }

    return result;
  } catch (error) {
    console.error("orders Model Error:", error);
    throw new Error(`orders Model DB error ${error.message}`);
  }
};

export const getOrderByUserIdModel = async (userId) => {
  try {
    const query = "SELECT * FROM orders WHERE user_id = ?";
    const [result] = await db.query(query, [userId]);
    return result.length === 0 ? null : result;
  } catch (error) {
    console.error("orders Model Error:", error);
    throw new Error(`orders Model DB error ${error.message}`);
  }
};

export const editOrderByIdModel = async (status, orderId) => {
  try {
    const query = "UPDATE orders SET order_status = ? WHERE order_id = ?";
    const [results] = await db.query(query, [status, orderId]);
    return results.length === 0 ? null : results;
  } catch (error) {
    console.error("orders Model Error:", error);
    throw new Error(`orders Model DB error ${error.message}`);
  }
};

export const deleteOrderByIdModel = async (orderId) => {
  try {
    const query = "DELETE FROM orders WHERE order_id = ?";
    const [results] = await db.query(query, [orderId]);

    return results.length === 0 ? null : results;
  } catch (error) {
    console.error("orders Model Error:", error);
    throw new Error(`orders Model DB error ${error.message}`);
  }
};

export const getUserPhoneById = async (userId) => {
  try {
    const query = "SELECT phone FROM users WHERE id = ?"; // Adjust the column name as needed
    const [results] = await db.query(query, [userId]);
    return results.length === 0 ? null : results[0].phone; // Return user's phone or null
  } catch (error) {
    console.error("GetUserPhone Error:", error);
    throw new Error(`Database error: ${error.message}`);
  }
};

export const deleteCartByUserIdModel = async (userId) => {
  try {
    const query = "DELETE FROM carts WHERE user_id = ?";
    const [result] = await db.query(query, [userId]);
    return result.length === 0 ? null : result;
  } catch (error) {
    console.error("deleteCartByUserIdModel Error:", error);
    throw new Error(`deleteCartByUserIdModel Database error: ${error.message}`);
  }
};

export const getLatestOrderModel = async () => {
  try {
    const query = `
      SELECT 
        orders.*,
        addresses.*
      FROM 
        orders
      INNER JOIN addresses ON orders.address_id = addresses.address_id
      ORDER BY orders.created_at DESC
      LIMIT 10
    `;
    const [results] = await db.query(query);
    return results.length === 0 ? null : results;
  } catch (error) {
    console.error("orders Model Error:", error);
    throw new Error(`orders Model DB error ${error.message}`);
  }
};

export const getOrderCountModel = async () => {
  try {
    const query = `SELECT COUNT(*) as count FROM orders`;
    const [results] = await db.query(query);
    return results.length === 0 ? null : results[0];
  } catch (error) {
    console.error("orders Model Error:", error);
    throw new Error(`orders Model DB error ${error.message}`);
  }
};

// Order Stock API
// export const getProductStockById = async (productId) => {
//   try {
//     const query = 'SELECT stock, stock_type FROM product WHERE product_id = ?';
//     const [rows] = await db.query(query, [productId]);

//     if (rows.length === 0) {
//       return null;  // Product not found
//     }

//     return rows[0];  // Return product details
//   } catch (error) {
//     console.log("getProductStockById Error", error);
//     throw new Error("Error fetching product stock");
//   }
// };

// export const updateProductStock = async (productId, newStock) => {
//   try {
//     const query = 'UPDATE product SET stock = ? WHERE product_id = ?';
//     await db.query(query, [newStock, productId]);
//   } catch (error) {
//     console.log("updateProductStock Error", error);
//     throw new Error("Error updating product stock");
//   }
// };

// Add reward points to the user's wallet
export const addWalletReward = async (userId, points) => {
  try {
    // Retrieve the current wallet balance
    const [currentBalance] = await db.query("SELECT SUM(points) AS balance FROM wallets WHERE user_id = ?", [userId]);

    // Calculate the new balance
    const newBalance = currentBalance[0].balance + points;

    // Update wallet with the new balance (or create a new record if none exists)
    await db.query("INSERT INTO wallets (user_id, points) VALUES (?, ?) ON DUPLICATE KEY UPDATE points = ?", [userId, points, newBalance]);

    return newBalance;  // Return the updated balance
  } catch (error) {
    console.log("Error adding wallet points", error);
    throw new Error("Error updating wallet points");
  }
};


// Get wallet points for a user
export const getWalletPoints = async (userId) => {
  const [rows] = await db.query('SELECT points FROM wallets WHERE user_id = ?', [userId]);
  return rows.length > 0 ? rows[0].points : 0;
};

// // Deduct points from the wallet after order completion
// export const updateWalletPoints = async (userId, pointsUsed) => {
//   await db.query('UPDATE wallets SET points = points - ? WHERE user_id = ?', [pointsUsed, userId]);
// };


export const getProductStockById = async (id) => {
  try {
    const query = 'SELECT stock, stock_type FROM product WHERE product_id = ?';
    const [rows] = await db.query(query, [id]);

    if (rows.length === 0) {
      return null;  // Product not found
    }

    return rows[0];  // Return product details
  } catch (error) {
    console.log("getProductStockById Error", error);
    throw new Error("Error fetching product stock");
  }
};

export const updateProductStock = async (id, newStock) => {
  try {
    const query = 'UPDATE product SET stock = ? WHERE product_id = ?';
    await db.query(query, [newStock, id]);
  } catch (error) {
    console.log("updateProductStock Error", error);
    throw new Error("Error updating product stock");
  }
};



// Wallets Modal
// Get wallet by userId
export const getWalletByUserId = async (userId) => {
  const query = `SELECT * FROM wallets WHERE user_id = ?`;
  const [rows] = await db.query(query, [userId]);
  return rows.length > 0 ? rows[0] : null;
};

// Create wallet for the user
export const createWalletForUser = async (userId) => {
  const query = `INSERT INTO wallets (user_id, points) VALUES (?, 0)`;
  await db.query(query, [userId]);
};

// Update wallet points (add or subtract points)
export const updateWalletPoints = async (userId, points) => {
  const query = `UPDATE wallets SET points = points + ? WHERE user_id = ?`;
  await db.query(query, [points, userId]);
};





