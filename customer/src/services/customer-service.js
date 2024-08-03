const customerRepository = require('../database/repository/customer-repository');
const { FormateData, GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword } = require('../utils');

const signIn = async (userInputs) => {
    const { email, password } = userInputs;
    const existingCustomer = await customerRepository.FindCustomer({ email });

    if (existingCustomer) {
        const validPassword = await ValidatePassword(password, existingCustomer.password, existingCustomer.salt);
        if (validPassword) {
            const token = await GenerateSignature({ email: existingCustomer.email, _id: existingCustomer.id });
            return FormateData({ id: existingCustomer.id, token });
        }
    }

    return FormateData(null);
};

const signUp = async (userInputs) => {
    const { email, password, phone } = userInputs;
    const existingCustomer = await customerRepository.FindCustomer({ email });

    if (existingCustomer) {
        return FormateData({ error: 'Customer already exists' });
    }

    let salt = await GenerateSalt();
    let userPassword = await GeneratePassword(password, salt);

    const newCustomer = await customerRepository.CreateCustomer({ email, password: userPassword, phone, salt });
    const token = await GenerateSignature({ email: email, _id: newCustomer.id });

    return FormateData({ id: newCustomer.id, token });
};

const addNewAddress = async (customerId, userInputs) => {
    const { street, postalCode, city, country } = userInputs;
    const addressResult = await customerRepository.CreateAddress({ customerId, street, postalCode, city, country });
    return FormateData(addressResult);
};

const getProfile = async (id) => {
    const existingCustomer = await customerRepository.FindCustomerById(id);
    return FormateData(existingCustomer);
};

const getWishlist = async (customerId) => {
    const wishListItems = await customerRepository.Wishlist(customerId);
    return FormateData(wishListItems);
};

const addToWishlist = async (customerId, product) => {
    const wishlistResult = await customerRepository.AddWishlistItem(customerId, product);
    return FormateData(wishlistResult);
};

const manageCart = async (customerId, product, qty, isRemove) => {
    const cartResult = await customerRepository.AddCartItem(customerId, product, qty, isRemove);
    return FormateData(cartResult);
};

const manageOrder = async (customerId, order) => {
    const orderResult = await customerRepository.AddOrderToProfile(customerId, order);
    return FormateData(orderResult);
};

module.exports = {
    signIn,
    signUp,
    addNewAddress,
    getProfile,
    getWishlist,
    addToWishlist,
    manageCart,
    manageOrder
};
