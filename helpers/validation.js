const Joi = require('joi');

const testValidation = Joi.object({
    name: Joi.string().required(),
    si: Joi.string().lowercase().required(),
    conventional: Joi.string().allow("",null).default(null),
})
const subCatValidation = Joi.object({
    subcat_name: Joi.string().lowercase().required(),
    category_id: Joi.number().min(1).required(),
    subcat_status: Joi.number().min(0).required()
})


const orderFiltersValidation = Joi.object({
    page: Joi.number().min(1).default(1),
    user_id: Joi.number().min(1),
    order_status: Joi.number().min(0),
    date_after: Joi.date(),
    date_before: Joi.date()
})
const orderValidation = Joi.object({
    user_id: Joi.number().min(1).required(),
    shipping_address1: Joi.string().required(),
    shipping_address2: Joi.string().allow('', null),
    city: Joi.string().required(),
    phone: Joi.string().required(),
    order_note: Joi.string().required(),
    order_items: Joi.array().items(Joi.object({
        part_id: Joi.number().min(1).required(),
        quantity: Joi.number().min(1).required()
    })).min(1).required()
})
const editOrderValidation = Joi.object({
    shipping_address1: Joi.string(),
    shipping_address2: Joi.string().allow('', null),
    city: Joi.string(),
    phone: Joi.string(),
    order_note: Joi.string(),
    order_status: Joi.number().min(0)
})

const partFiltersValidation = Joi.object({
    page: Joi.number().min(1).default(1),
    subcat_id: Joi.number().min(1),
    min_price: Joi.number().min(0),
    max_price: Joi.number().min(0),
    min_rating: Joi.number().min(0).max(5),
    featured: Joi.number().valid(0, 1),
    vehicle: Joi.string(),
    shop_id: Joi.number().min(0),
    part_name: Joi.string(),
    order_by: Joi.string().valid('price', 'rating', 'condition'),
    order: Joi.string().uppercase().valid('DESC', 'ASC'),
    part_status: Joi.number().min(0),
    make: Joi.string(),
})
const partValidation = Joi.object({
    part_name: Joi.string().required(),
    part_serial: Joi.string().uppercase().required(),
    subcat_id: Joi.number().min(1).required(),
    part_description: Joi.string().required(),
    part_price: Joi.number().min(0).required(),
    part_quantity: Joi.number().required(),
    shop_id: Joi.number().min(0).required(),
    part_fits_vehicles: Joi.string().required(),
    part_condition: Joi.string().required()
})
const editPartValidation = Joi.object({
    part_name: Joi.string(),
    part_serial: Joi.string().uppercase(),
    subcat_id: Joi.number().min(1),
    part_description: Joi.string(),
    part_price: Joi.number().min(0),
    part_quantity: Joi.number(),
    shop_id: Joi.number().min(0),
    part_fits_vehicles: Joi.string(),
    part_condition: Joi.string(),
    part_is_featured: Joi.number().valid(0, 1),
    part_status: Joi.number().min(0)
})


const shopFiltersValidation = Joi.object({
    page: Joi.number().min(1).default(1),
    service_code: Joi.number().min(100).message('Invalid Service Code!!!'),
    shop_status: Joi.number().min(0)
})
const shopValidation = Joi.object({
    shop_name: Joi.string().required(),
    shop_address: Joi.string().allow('').required(),
    shop_lat: Joi.number().allow(null).default(null).required(),
    shop_long: Joi.number().allow(null).default(null).required(),
    shop_description: Joi.string().allow('').required(),
    shop_email: Joi.string().email().allow('').required(),
    shop_phone: Joi.string().required(),
    shop_website: Joi.string().uri().allow('').required()
})
const editShopValidation = Joi.object({
    shop_name: Joi.string(),
    shop_address: Joi.string().allow(''),
    shop_lat: Joi.number().allow(null),
    shop_long: Joi.number().allow(null),
    shop_description: Joi.string().allow(''),
    shop_email: Joi.string().email().allow(''),
    shop_phone: Joi.string(),
    shop_website: Joi.string().uri().allow('')
})
const nearShopValidation = Joi.object({
    service_code: Joi.number().min(100).message('Invalid Service Code!!!').required(),
    long: Joi.number().required(),
    lat: Joi.number().required()
})

const serviceValidation = Joi.object({
    service_codes: Joi.array().items(
        Joi.number().min(100).message('Invalid Service Code!!!')
    ).min(1).required(),
    service_pricings: Joi.array().items(Joi.object()).min(1).required()
})
const editServiceValidation = Joi.object({
    service_code: Joi.number().min(100).message('Invalid Service Code!!!').required(),
    service_pricings: Joi.object().required()
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



// const partValidation = Joi.array().items(Joi.object({
//     name: Joi.string().required(),
//     image: Joi.any(),
//     sizes: Joi.array().items(Joi.object({
//         size: Joi.string().required(),
//         price: Joi.number().min(0).required()
//     }))
// }))

// const registerValidation = Joi.object({
//     name: Joi.string().min(3).required(),
//     email: Joi.string().min(6).required().email(),
//     password: Joi.string().min(6).required(),
// })


// const loginValidation = Joi.object({
//     email: Joi.string().min(6).required().email(),
//     password: Joi.string().min(6).required(),
// });

module.exports = {
    testValidation,
    userValidation,
    userLoginValidation,

    subCatValidation,
    orderFiltersValidation,
    orderValidation,
    editOrderValidation,
    partFiltersValidation,
    partValidation,
    editPartValidation,
    shopFiltersValidation,
    shopValidation,
    editShopValidation,
    nearShopValidation,
    serviceValidation,
    editServiceValidation,
    userFiltersValidation,
    editUserValidation
}