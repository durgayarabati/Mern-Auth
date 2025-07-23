import pkg from 'jsonwebtoken';
const { sign, verify, JsonWebTokenError } = pkg;


const userAuth = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.json({
            sucess: false,
            message: "Not Authorized,Login again"
        })
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)

        if (tokenDecode.id) {
            req.body.userId = tokenDecode.id
        } 
        else {
            return res.json({sucess:false,message:'Not Authorized,Login again'})

        }

        next();

    } catch (error) {

    }
}

export default userAuth;