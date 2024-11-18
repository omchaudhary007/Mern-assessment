import Admin from "../model/admin.js";
import deviceDetector from "../services/deviceDetector.js";

export const LoginController = async (req, res) => {
  try {
    const { userName, password } = req.body;
    if (!userName || !password) {
      return res.status(400).send({
        success: false,
        message: "Please provide required fields.",
      });
    }
    const adminData = await Admin.findOne({ userName });
    if (!adminData) {
      return res.status(400).send({
        success: false,
        message: "Admin not exists",
      });
    }
    const isPasswordValid = await adminData.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(404).send({
        success: false,
        message: "Incorrect Password.",
      });
    }

    // Token creation and using cookie for browser only
    const token = await adminData.generateToken();
    const userClient = req.headers["user-agent"] || "";
    const isBrowser = deviceDetector(userClient);

    if (isBrowser) {
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // for 30days
        path: "/",
      });
    } else {
      res.setHeader("Authorization", `Bearer ${token}`);
    }
    res.status(200).send({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      message: "Error in login API.",
    });
  }
};

export const getAdminController = async (req, res) => {
  if (!req.adminData) {
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
  return res.status(200).send({
    success: true,
    message: "Admin fetched successfully",
    userName: req.adminData?.userName,
  });
};

export const logoutController = async (req, res) => {
  try {
    const userClient = req.headers["user-agent"] || "";
    const isBrowser = deviceDetector(userClient);

    if (isBrowser) {
      res.cookie("token", "", {
        expires: new Date(0),
      });
    } else {
      res.removeHeader("Authorization");
    }

    return res.status(200).send({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal server error. Logout failed!",
    });
  }
};
