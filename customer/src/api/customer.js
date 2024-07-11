const CustomerService = require('../services/customer-service');
const UserAuth = require('./middlewares/auth');
const { SubscribeMessage } = require('../utils');

/**
 * @swagger
 * tags:
 *   name: Customer
 *   description: Customer management
 */

module.exports = (app, channel) => {
    
    const service = new CustomerService(channel);

    // To listen
    SubscribeMessage(channel, service);

    /**
     * @swagger
     * /customer/signup:
     *   post:
     *     summary: Sign up a new customer
     *     tags: [Customer]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *               - phone
     *             properties:
     *               email:
     *                 type: string
     *                 example: user@example.com
     *               password:
     *                 type: string
     *                 example: password123
     *               phone:
     *                 type: string
     *                 example: 1234567890
     *     responses:
     *       200:
     *         description: The customer was successfully created
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *       400:
     *         description: Bad request
     */
    app.post('/signup', async (req, res, next) => {
        const { email, password, phone } = req.body;
        const result = await service.SignUp({ email, password, phone });
        if (result.error) {
            return res.status(400).json(result);
        }
        res.json(result);
    });

    /**
     * @swagger
     * /customer/login:
     *   post:
     *     summary: Log in a customer
     *     tags: [Customer]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *                 example: user@example.com
     *               password:
     *                 type: string
     *                 example: password123
     *     responses:
     *       200:
     *         description: Successfully logged in
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *       400:
     *         description: Bad request
     */
    app.post('/login',  async (req,res,next) => {
        const { email, password } = req.body;
        const { data } = await service.SignIn({ email, password});
        res.json(data);
    });

    /**
     * @swagger
     * /customer/address:
     *   post:
     *     summary: Add a new address for the customer
     *     tags: [Customer]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - street
     *               - postalCode
     *               - city
     *               - country
     *             properties:
     *               street:
     *                 type: string
     *                 example: 123 Main St
     *               postalCode:
     *                 type: string
     *                 example: 12345
     *               city:
     *                 type: string
     *                 example: Springfield
     *               country:
     *                 type: string
     *                 example: USA
     *     responses:
     *       200:
     *         description: Successfully added address
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *       400:
     *         description: Bad request
     *       401:
     *         description: Unauthorized
     */
    app.post('/address', UserAuth, async (req,res,next) => {
        const { _id } = req.user;
        const { street, postalCode, city, country } = req.body;
        const { data } = await service.AddNewAddress( _id ,{ street, postalCode, city, country });
        res.json(data);
    });

    /**
     * @swagger
     * /customer/profile:
     *   get:
     *     summary: Get customer profile
     *     tags: [Customer]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Successfully fetched profile
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *       401:
     *         description: Unauthorized
     */
    app.get('/profile', UserAuth ,async (req,res,next) => {
        const { _id } = req.user;
        const { data } = await service.GetProfile({ _id });
        res.json(data);
    });

    /**
     * @swagger
     * /customer/shoping-details:
     *   get:
     *     summary: Get shopping details for the customer
     *     tags: [Customer]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Successfully fetched shopping details
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *       401:
     *         description: Unauthorized
     */
    app.get('/shoping-details', UserAuth, async (req,res,next) => {
        const { _id } = req.user;
        const { data } = await service.GetShopingDetails(_id);
        return res.json(data);
    });

    /**
     * @swagger
     * /customer/wishlist:
     *   get:
     *     summary: Get wishlist for the customer
     *     tags: [Customer]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Successfully fetched wishlist
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *       401:
     *         description: Unauthorized
     */
    app.get('/wishlist', UserAuth, async (req,res,next) => {
        const { _id } = req.user;
        const { data } = await service.GetWishList( _id);
        return res.status(200).json(data);
    });

    /**
     * @swagger
     * /customer/whoami:
     *   get:
     *     summary: Check customer service status
     *     tags: [Customer]
     *     responses:
     *       200:
     *         description: Service is running
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     */
    app.get('/whoami', (req,res,next) => {
        return res.status(200).json({msg: '/customer : I am Customer Service'})
    });
}
