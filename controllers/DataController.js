const mongoose = require('mongoose');
const { dataValidation,dataFiltersValidation,getDataValidation } = require('../helpers/validation');
/**
 * @type {mongoose.Model}
 */
const tests = {
    "hemoglobin-hb": require('../models/hemoHb'),
    "hematocrit-hct": require('../models/hematocrit'),
    "rbc":require('../models/rbc'),
    "wbc":require('../models/wbc'),
    "platelet":require('../models/platelet'),
    "lymphocytesl":require('../models/lymphocytesl'),
    "lymphocytes":require('../models/lymphocytes'),
    "monocytesl":require('../models/monocytesl'),
    "monocytes":require('../models/monocytes'),
    "neutrophilsl":require('../models/neutrophilsl'),
    "neutrophils":require('../models/neutrophils'),
    "eosinophill":require('../models/eosinophill'),
    "eosinophil":require('../models/eosinophil'),
    "basophill":require('../models/basophill'),
    "basophil":require('../models/basophil'),
    "mcvfl":require('../models/mcvfl'),
    "cd4":require('../models/cd4'),
    "cd4cellsul":require('../models/cd4cellsul'),
    "cd8cellsul":require('../models/cd8cells_ul'),
    "cd8":require('../models/cd8'),
    "mch":require('../models/mch'),
    "mchc":require('../models/mchc'),

}

const createData = (req, res) => {
    const { error, value } = dataValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message })
    if(!req.params.test in tests) return res.status(400).json({"message":`'${req.params.test}' is not a valid test`});

    const data = new tests[req.params.test](value);
    data.save().then(newTest => {
        return res.status(201).json(data);
    }).catch(err => {
        console.log(err)
        res.status(500).json({ error: err });
    });
}


const getData = async (req, res) => {
    const { error, value } = dataFiltersValidation.validate(req.query);
    if (error) return res.status(400).json({ message: error.details[0].message })
    
    let dataFilter = {country: value.country};
    dataFilter[value.ageGroup] = true;
    if(value.gender>0 && value.gender<3) dataFilter['gender']=value.gender;
    
    tests[req.params.test].find(dataFilter)
    .select('-pediatric -adult -geriatric')
    .sort('gender')
    .then(dataset=>{
        return res.status(200).json(dataset);
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ error: err });
    });
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
    } catch (error) {
        console.log(error);
        return res.status(500).json({});
    }

    await tests[req.params.test].findByIdAndUpdate(req.params.id,value)
        .then(updatedTest => {
            return res.json(updatedTest);
        }).catch(err => {
            console.log(err)
            res.status(500).json({ error: err });
        });
}

module.exports = {
    createData,
    getData,
    editData
};