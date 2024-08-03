const { Customer, Address } = require('../models');

async function CreateCustomer({ email, password, phone, salt }) {
    const customer = await Customer.create({
        email,
        password,
        salt,
        phone
    });
    return customer;
}

async function CreateAddress({ customerId, street, postalCode, city, country }) {
    const address = await Address.create({
        street,
        postalCode,
        city,
        country,
        CustomerId: customerId
    });
    return address;
}

async function FindCustomer({ email }) {
    const existingCustomer = await Customer.findOne({ where: { email } });
    return existingCustomer;
}

async function FindCustomerById({ id }) {
    const existingCustomer = await Customer.findByPk(id, { include: Address });
    return existingCustomer;
}

async function Wishlist(customerId) {
    const customer = await Customer.findByPk(customerId);
    return customer ? customer.wishlist : [];
}

async function AddWishlistItem(customerId, product) {
    const customer = await Customer.findByPk(customerId);
    if (customer) {
        customer.wishlist.push(product);
        await customer.save();
        return customer.wishlist;
    }
    return null;
}

async function AddCartItem(customerId, product, qty, isRemove) {
    const customer = await Customer.findByPk(customerId);
    if (customer) {
        const cartItem = customer.cart.find(item => item.productId === product._id);
        if (cartItem) {
            if (isRemove) {
                customer.cart = customer.cart.filter(item => item.productId !== product._id);
            } else {
                cartItem.quantity += qty;
            }
        } else {
            customer.cart.push({ productId: product._id, quantity: qty });
        }
        await customer.save();
        return customer.cart;
    }
    return null;
}

async function AddOrderToProfile(customerId, order) {
    const customer = await Customer.findByPk(customerId);
    if (customer) {
        customer.orders.push(order);
        await customer.save();
        return customer.orders;
    }
    return null;
}

module.exports = {
    CreateCustomer,
    CreateAddress,
    FindCustomer,
    FindCustomerById,
    Wishlist,
    AddWishlistItem,
    AddCartItem,
    AddOrderToProfile
};
