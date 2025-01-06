import { createKumbModel, deleteKumbByIdModel, editKumbStatusByIdModel, getAllKumbModel, getKumbByIdModel } from "../../models/kumb.model.js";

export const createKumb = async (req, res) => {
    try {
        // Extract data from the request body
        const { firstName, middleName, lastName, email, phone, objective } = req.body;

        // Validate required fields
        if (!firstName || !email || !phone) {
            return res.status(400).json({ message: "First name, email, and phone are required!" });
        }

        // Call the model to insert the data
        const result = await createKumbModel(firstName, middleName, lastName, email, phone, objective);

        return res.status(201).json({ message: "Kumb Data Created Successfully!", data : result });

    } catch (error) {
        console.error('Create Kumb Controller Error:', error);
        return res.status(500).json({ message: 'An unexpected error occurred.' });
    }
};

export const getAllKumb = async (req, res) => {
    try {
        const result = await getAllKumbModel();

        if (result.success === false) {
            return res.status(500).json({ message: result.message });
        }

        return res.status(200).json({
            message: "Kumb data retrieved successfully.",
            data: result
        });

    } catch (error) {
        console.error('Kumb Controller Error:', error);
        return res.status(500).json({ message: 'An unexpected error occurred.' });
    }
};

export const getKumbById = async (req, res) => {
    try {
        const { kumbId } = req.params;

        if (!kumbId) {
            return res.status(400).json({ message: "Kumb ID is required!" });
        }

        const kumbData = await getKumbByIdModel(kumbId);

        if (!kumbData) {
            return res.status(404).json({ message: "Kumb not found!" });
        }

        return res.status(200).json({
            message: "Kumb data retrieved successfully.",
            data: kumbData
        });

    } catch (error) {
        console.error('Kumb Controller Error:', error);
        return res.status(500).json({ message: 'An unexpected error occurred.' });
    }
};

export const editBussinessStatusById = async (req, res) => {
    try {
        const { kumbId } = req.params;
        const { status } = req.body;

        if(!kumbId) {
            return res.status(500).json('Id is required!');
        }

        if(!status) {
            return res.status(500).json('Status is required!');
        }

        const result = await editKumbStatusByIdModel(status, kumbId);

        return res.status(201).json({ message : "Status update successfully!" })
    } catch (error) {
        console.log('business error : ', error);
        return res.status(500).json('Internal Server Error');
    }
}


export const deleteKumbById = async (req, res) => {
    try {
        const { kumbId } = req.params;

        if (!kumbId) {
            return res.status(400).json({ message: "Kumb ID is required!" });
        }

        const result = await deleteKumbByIdModel(kumbId);

        if (!result.success) {
            return res.status(404).json({ message: result.message });
        }

        return res.status(200).json({ message: result.message });

    } catch (error) {
        console.error('Delete Kumb Controller Error:', error);
        return res.status(500).json({ message: 'An unexpected error occurred.' });
    }
};
