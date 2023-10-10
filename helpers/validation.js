const Joi = require('joi');

const testValidation = Joi.object({
    name: Joi.string().required(),
    slug: Joi.string().regex(/^[a-z0-9-]+$/)
    .message('Invalid slug format. Only lowercase letters, numbers, and hyphens are allowed.')
    .required(),
    si: Joi.string().lowercase().required(),
    conventional: Joi.string().allow("",null).default(null),
})
const dataValidation = Joi.object({
    reference: Joi.string().required(),
    ageGroup: Joi.string().required(),
    lrl: Joi.number().min(0).required(),
    url: Joi.number().min(0).required(),
    pediatric: Joi.boolean().default(false),
    adult: Joi.boolean().default(false),
    geriatric: Joi.boolean().default(false),
    mean: Joi.number().min(0).optional().allow(null),
    sd: Joi.number().min(0).optional().allow(null),
    cv: Joi.number().min(0).optional().allow(null),
    sampleSize: Joi.number().min(0).optional().allow(null),
    gender: Joi.number().min(1).max(2).required(),
    country: Joi.string().required(),
    link: Joi.string().optional().allow("",null)
})
const dataFiltersValidation = Joi.object({
    ageGroup: Joi.string().required().valid('pediatric','adult','geriatric'),
    gender: Joi.number().valid(0,1,2).default(0),
    country: Joi.string().required()
})
const editDataValidation = Joi.object({
    reference: Joi.string().optional(),
    ageGroup: Joi.string().optional(),
    lrl: Joi.number().min(0).optional(),
    url: Joi.number().min(0).optional(),
    pediatric: Joi.boolean().optional(),
    adult: Joi.boolean().optional(),
    geriatric: Joi.boolean().optional(),
    mean: Joi.number().min(0).optional().allow(null),
    sd: Joi.number().min(0).optional().allow(null),
    cv: Joi.number().min(0).optional().allow(null),
    sampleSize: Joi.number().min(0).optional().allow(null),
    gender: Joi.number().min(1).max(2).optional(),
    country: Joi.string().optional(),
    link: Joi.string().optional().allow("",null)
})

const userValidation = Joi.object({
    title: Joi.string().min(2).max(5).required(),
    position: Joi.string().trim().allow('',null),
    firstName: Joi.string().trim().required(),
    lastName: Joi.string().trim().required(),
    email: Joi.string().trim().email().required().lowercase(),
    institution: Joi.string().trim().allow('',null),
    city: Joi.string().trim().required(),
    country: Joi.string().required(),
    password: Joi.string().min(3).required()
})
const userLoginValidation = Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().required()
})






const userFiltersValidation = Joi.object({
    page: Joi.number().min(1).default(1),
    shop_id: Joi.number().min(0),
    username: Joi.string().allow('', null),
    first_name: Joi.string().allow('', null),
    last_name: Joi.string().allow('', null),
    user_email: Joi.string().email().allow('', null),
    user_phone: Joi.string().allow('', null),
    is_shop_admin: Joi.boolean(),
    is_admin: Joi.boolean(),
    user_status: Joi.number()
})
const editUserValidation = Joi.object({
    username: Joi.string().allow('', null),
    first_name: Joi.string().allow('', null),
    last_name: Joi.string().allow('', null),
    user_email: Joi.string().email().allow('', null),
    user_phone: Joi.string().allow('', null),
    shop_id: Joi.number().min(0),
    is_shop_admin: Joi.boolean(),
    is_admin: Joi.boolean(),
    user_status: Joi.number()
})

module.exports = {
    testValidation,
    userValidation,
    userLoginValidation,
    dataValidation,
    dataFiltersValidation,
    editDataValidation,

    userFiltersValidation,
    editUserValidation
}