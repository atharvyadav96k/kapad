const billSchema = require('../models/billModel');
exports.get = async (req, res) => {

}

exports.add = async (req, res) => {
    const { id } = req.params;
    const { name, size, count } = req.body;

    try {
        const bill = await billSchema.findById(id);
        if (bill) {
            let products = bill.product;
            const index = products.findIndex(product => product.name === name);

            if (index === -1) {
                products.push({ name, quality: [{ size, count }] });
            } else {
                let existingProduct = products[index];
                const qualityIndex = existingProduct.quality.findIndex(quality => quality.size == size);
                if (qualityIndex == - 1) {
                    existingProduct.quality.push({ size, count });
                } else {
                    existingProduct.quality[qualityIndex].count = Number(existingProduct.quality[qualityIndex].count) + Number(count);

                }
            }

            bill.product = products;
            await bill.save();

            return res.status(201).json({
                message: 'Product added successfully'
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


exports.edit = async (req, res) => {
    const { id } = req.params;
    const { name, size, count } = req.body;

    try {
        const bill = await billSchema.findById(id);
        if (bill) {
            let products = bill.product;
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
            let products = bill.product;
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
        if (bill) {
            let products = bill.product;
            const productIndex = products.findIndex(product => product.name === name);
            if (productIndex === -1) {
                return res.status(404).json({
                    error: 'Product not found in the bill'
                });
            }
            let existingProduct = products[productIndex];
            const qualityIndex = existingProduct.quality.findIndex(quality => quality.size == size);
            if (qualityIndex == -1) {
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
