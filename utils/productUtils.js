const billSchema = require('../models/billModel');
const {deliver} = require('../utils/logsUtils/deliveredItem');

exports.get = async (req, res) => {
    const { id } = req.params;
    try {
        const bill = await billSchema.findById(id);
        res.status(200).json({ data: bill.products });
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.getAll = async (req, res) => {
    const page = Math.max(parseInt(req.params.page) || 1, 1); // Ensure page is at least 1
    const limit = 400;
    const skip = (page - 1) * limit;
    console.log(page);
    try {
        const totalCount = await billSchema.countDocuments();
        const bills = await billSchema
            .find()
            .select("id partyName chalanNo baleNo date")
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);

        const totalPages = Math.ceil(totalCount / limit);
        // console.log(bills);
        return res.status(200).json({
            data: bills,
            totalCount,
            currentPage: page,
            totalPages,
        });
    } catch (err) {
        return res.status(500).json({ message: "Failed to fetch bills: " + err.message });
    }
};


exports.getSearch = async (req, res) => {
    const { chalaNo } = req.params;
    try {
        const bills = await billSchema
            .find({ chalanNo: chalaNo })
            .select("id partyNo chalanNo baleNo date");
        const reverse = bills.reverse();
        return res.status(200).json({
            data: reverse
        })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

exports.add = async (req, res) => {
    const { id } = req.params;
    const { name, size, count, productId } = req.body;

    try {
        console.log(productId);
        const bill = await billSchema.findById(id);

        if (!bill) {
            return res.status(404).json({ error: 'Bill not found' });
        }

        let products = bill.products || [];
        bill.billStatus = 1;
        const response = await deliver({productId, quantity: parseFloat(size) * parseFloat(count), partyId: bill.partyId, chalanId: id});
        console.log(response)
        if(!response.success){
            return res.status(300).json({
                success: false,
                message: "Unable to add item"
            });
        }
        const productIndex = products.findIndex(product => product.name === name);

        if (productIndex === -1) {
            products.push({ name, quality: [{ size, count }] });
        } else {
            let existingProduct = products[productIndex];
            existingProduct.quality = existingProduct.quality || [];

            const qualityIndex = existingProduct.quality.findIndex(quality => quality.size == size);
            if (qualityIndex === -1) {
                existingProduct.quality.push({ size, count });
            } else {
                existingProduct.quality[qualityIndex].count =
                    Number(existingProduct.quality[qualityIndex].count) + Number(count);
            }
        }

        bill.products = products;
        await bill.save();

        return res.status(201).json({ message: 'Product added successfully' });

    } catch (err) {
        console.error("Error adding product:", err);
        return res.status(500).json({ error: 'An error occurred while adding the product.' });
    }
};

exports.addremark = async (req, res) => {
    console.log("Hello")
    const { id } = req.params;
    const { name, remark } = req.body;
    console.log("Remark")
    console.log(id);
    console.log(name, remark);
    try {
        const bill = await billSchema.findById(id);
        if (!bill) {
            return res.status(404).json({ error: 'Bill not found' });
        }
        const productIndex = bill.products.findIndex(product => product.name === name);
        if (productIndex === -1) {
            return res.status(404).json({ error: 'Product not found' });
        }

        bill.products[productIndex].remark = remark;
        // console.log(bill);

        await bill.save();

        return res.status(200).json({ message: 'Remark added successfully' });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}


exports.edit = async (req, res) => {
    const { id } = req.params;
    const { name, size, count } = req.body;

    try {
        const bill = await billSchema.findById(id);
        if (bill) {
            let products = bill.products;
            const productIndex = products.findIndex(product => product.name === name);
            if (productIndex === -1) {
                return res.status(404).json({
                    error: "Product not found in bill"
                });
            } else {
                let existingProduct = products[productIndex];
                const qualityIndex = existingProduct.quality.findIndex(quality => quality.size == size);
                if (qualityIndex === -1) {
                    return res.status(404).json({
                        error: "No product found with this size"
                    });
                } else {
                    existingProduct.quality[qualityIndex] = { size, count };
                    await bill.save();
                    return res.status(200).json({
                        message: "Product quality updated successfully"
                    });
                }
            }
        } else {
            return res.status(404).json({
                error: "Bill not found"
            });
        }
    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
};

exports.deleteByName = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;  // Fix typo: req.body, not rea.body

    try {
        // Find the bill by ID
        const bill = await billSchema.findById(id);

        if (bill) {
            let products = bill.producst;
            const productIndex = products.findIndex(product => product.name === name);

            if (productIndex === -1) {
                return res.status(404).json({
                    error: 'Product not found in the bill'
                });
            }

            // Remove the product from the array
            products.splice(productIndex, 1);

            // Save the updated bill
            await bill.save();

            return res.status(200).json({
                message: 'Product deleted successfully'
            });
        } else {
            return res.status(404).json({
                error: 'Bill not found'
            });
        }
    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
};

exports.deleteQuality = async (req, res) => {
    const { id } = req.params;
    const { name, size } = req.body;
    try {
        const bill = await billSchema.findById(id);
        // console.log(bill)
        if (bill) {
            let products = bill.products;
            // console.log(products)
            const productIndex = products.findIndex(product => product.name === name);
            if (productIndex === -1) {
                return res.status(404).json({
                    error: 'Product not found in the bill'
                });
            }
            let existingProduct = products[productIndex];
            const qualityIndex = existingProduct.quality.findIndex(quality => quality.size == size);
            if (qualityIndex == -1) {
                console.log("error 404 1")
                return res.status(404).json({
                    error: 'No quality found with the given size'
                });
            }
            existingProduct.quality.splice(qualityIndex, 1);
            await bill.save();
            return res.status(200).json({
                message: 'Quality deleted successfully'
            });
        } else {
            console.log("error 404 2")
            return res.status(404).json({
                error: 'Bill not found'
            });
        }
    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
};
