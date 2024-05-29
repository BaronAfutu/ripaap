const mongoose = require('mongoose');
const { dataValidation, dataFiltersValidation, getDataValidation } = require('../helpers/validation');
/**
 * @type {mongoose.Model}
*/
const testType = {
    "hematology": require('../models/hematology_tests'),
    "chemical": require('../models/chemical_tests')
}

const createData = (req, res) => {
    try {
        const { error, value } = dataValidation.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message })
        if (!testType.hasOwnProperty(req.params.testType)) return res.status(400).json({ "message": `'${req.params.testType}' is not a valid test type` });

        const data = testType[req.params.testType].insertMany(value.data).then(data => {
            return res.status(201).json(data);
        }).catch(err => {
            console.log(err)
            res.status(500).json({ error: err });
        });
    } catch (error) {
        return res.status(400).json({ message: "Bad Request!!" });
    }
}

const getData = async (req, res) => {
    let dataFilter = {}
    if ('analyser' in req.query && req.query.analyser) {
        dataFilter['analyser'] = { $regex: `.*${req.query.analyser}.*` };
    }
    else {
        const { error, value } = dataFiltersValidation.validate(req.query);
        if (error) return res.status(400).json({ message: error.details[0].message })

        if (value.country) {
            dataFilter['country'] = { $regex: `.*${value.country}.*` };
        }
        dataFilter[value.ageGroup] = true;
        if (value.gender > 0 && value.gender < 3) dataFilter['gender'] = value.gender;
    }
    dataFilter['test'] = req.params.testID;

    try {
        // console.log(dataFilter);
        testType[req.params.testType].find(dataFilter)
            .select('-pediatric -adult -geriatric')
            .sort('gender')
            .then(dataset => {
                return res.status(200).json(dataset);
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({ error: err });
            });
    } catch (error) {
        console.log(error)
        return res.status(400).json({ message: "Bad Request!!" });
    }
}

const editData = async (req, res) => {
    const { error, value } = getDataValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message })
    try {
        const existingData = await tests[req.params.test].findById(req.params.id);
        if (!existingData) return res.status(302).json({ message: 'Data Not Found!!' });


        await tests[req.params.test].findByIdAndUpdate(req.params.id, value)
            .then(updatedTest => {
                return res.json(updatedTest);
            }).catch(err => {
                console.log(err)
                res.status(500).json({ error: err });
            });
    } catch (error) {
        console.log(error);
        return res.status(500).json({});
    }
}

/**
 * 
 * @param {Express.Request} req the request
 * @param {Express.Response} res the response
 */
const deleteData = async (req, res) => {
    try {
        await testType[req.params.testType].findByIdAndDelete(req.params.id)
            .then(deletedData => {
                return res.json(deletedData);
            }).catch(err => {
                console.log(err);
                res.status(500).json({ error: err });
            })
    } catch (error) {
        console.log(error);
        return res.status(500).json({});
    }

}


const getAnalysers = async (req, res) => {

    try {
        testType[req.params.testType].distinct('analyser', { test: req.params.testID })
            .then(dataset => {
                return res.status(200).json(dataset);
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({ error: err });
            });
    } catch (error) {
        console.log(error)
        return res.status(400).json({ message: "Bad Request!!" });
    }
}


module.exports = {
    createData,
    getData,
    editData,
    deleteData,
    getAnalysers
};