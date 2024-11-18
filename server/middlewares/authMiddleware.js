import JWT from "jsonwebtoken";
import adminModel from "../model/admin.js";
import deviceDetector from "../services/deviceDetector.js";

// Autherization function
const isAuth = async (req, res, next) => {
  const userClient = req.headers["user-agent"] || "";
  const isBrowser = deviceDetector(userClient);
  let token = undefined;
  if (isBrowser) {
    token = req.cookies?.token;
  } else {
    if(!req.headers.authorization){
      return res.status(401).send({
        succcess: false,
        message: "Unauthorized access",
      });
    }
    token = req?.headers?.authorization.split(" ")[1];
  }
  if (!token) {
    return res.status(401).send({
      succcess: false,
      message: "Unauthorized access! please login again.",
    });
  }
  JWT.verify(token, process.env.JWT_SECRET, async (error, adminId) => {
    if (error) {
      return res.status(401)
        .send({
          succcess: false,
          message: "Please log in or register to continue.",
        });
    } else {
      try {
        const adminData = await adminModel.findById(adminId.id);
        if (!adminData) {
          return res
            .status(401)
            .send({
              succcess: false,
              message: "Admin doesn't exists.",
            });
        }
        req.adminData = adminData;
        next(); 
      } catch (error) {
        return res.status(401).send({
            succcess: false,
            message: "Error in Auth API.",
          });
      }
    }
  });
};

export default isAuth;
