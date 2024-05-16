const mongoose = require('mongoose');
const { dataValidation, dataFiltersValidation, getDataValidation } = require('../helpers/validation');
/**
 * @type {mongoose.Model}
 */
const tests = {
    "hemoglobin-hb": require('../models/hemoHb'),
    "hematocrit-hct": require('../models/hematocrit'),
    "rbc": require('../models/rbc'),
    "wbc": require('../models/wbc'),
    "platelet": require('../models/platelet'),
    "lymphocytesl": require('../models/lymphocytesl'),
    "lymphocytes": require('../models/lymphocytes'),
    "monocytesl": require('../models/monocytesl'),
    "monocytes": require('../models/monocytes'),
    "neutrophilsl": require('../models/neutrophilsl'),
    "neutrophils": require('../models/neutrophils'),
    "eosinophill": require('../models/eosinophill'),
    "eosinophil": require('../models/eosinophil'),
    "basophill": require('../models/basophill'),
    "basophil": require('../models/basophil'),
    "mcvfl": require('../models/mcvfl'),
    "cd4": require('../models/cd4'),
    "cd4cellsul": require('../models/cd4cellsul'),
    "cd8cellsul": require('../models/cd8cells_ul'),
    "cd8": require('../models/cd8'),
    "mch": require('../models/mch'),
    "mchc": require('../models/mchc'),
    "chemical_tests": require('../models/chemical_tests')
}

const createData = (req, res) => {
    try {
        const { error, value } = dataValidation.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message })
        if (!tests.hasOwnProperty(req.params.test)) return res.status(400).json({ "message": `'${req.params.test}' is not a valid test` });

        const data = new tests[req.params.test](value);
        data.save().then(newTest => {
            return res.status(201).json(data);
        }).catch(err => {
            console.log(err)
            res.status(500).json({ error: err });
        });
    } catch (error) {
        return res.status(400).json({ message: "Bad Request!!" });
    }
}


const getAnalysers = async (req, res) => {

    try {
        tests[req.params.test].distinct('analyser')
            .then(dataset => {
                return res.status(200).json(dataset);
            })
            .catch(err => {
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

        dataFilter['country'] = { $regex: `.*${value.country}.*` };
        dataFilter[value.ageGroup] = true;
        if (value.gender > 0 && value.gender < 3) dataFilter['gender'] = value.gender;
        if (!tests.hasOwnProperty(req.params.test)){
            dataFilter['name'] = req.params.test;
            req.params.test = "chemical_tests";
        }
    }

    try {
        console.log(dataFilter);
        console.log(req.params.test)
        tests[req.params.test].find(dataFilter)
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

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Request} res 
 */
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

module.exports = {
    createData,
    getData,
    editData,
    getAnalysers
};