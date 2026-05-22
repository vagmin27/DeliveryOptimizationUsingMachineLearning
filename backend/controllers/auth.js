import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Register user
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password
    });

    await user.save();

    // Create JWT payload
    const payload = {
      user: {
        id: user.id
      }
    };

    // Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5 days' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error("REGISTER CONTROLLER EXCEPTION:", err);
    res.status(500).send('Server error');
  }
};

// Login user
export const login = async (req, res) => {
  console.log("LOGIN REQUEST BODY:", req.body);
  const { email, password } = req.body;
  console.log("LOGIN ROUTE HIT", email);

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    console.log("USER FOUND:", !!user);
    if (!user) {
      console.log("LOGIN FAILED: User not found for email:", email);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    console.log("PASSWORD MATCH:", isMatch);
    if (!isMatch) {
      console.log("LOGIN FAILED: Password mismatch for email:", email);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Create JWT payload
    const payload = {
      user: {
        id: user.id
      }
    };

    console.log("JWT_SECRET EXISTS:", !!process.env.JWT_SECRET);

    // Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5 days' },
      (err, token) => {
        if (err) {
          console.error("JWT SIGN ERROR:", err);
          throw err;
        }
        console.log("LOGIN SUCCESS: Token generated for email:", email);
        console.log("LOGIN SUCCESS");
        res.json({ token });
      }
    );
  } catch (err) {
    const error = err;
    console.error("LOGIN ERROR:", error);
    console.error("LOGIN CONTROLLER EXCEPTION:", err);
    res.status(500).send('Server error');
  }
};

// Get user
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get preferences
export const getPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('preferences');
    res.json(user.preferences || {});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update preferences
export const updatePreferences = async (req, res) => {
  try {
    const { theme, defaultAlgorithm, preferRoadNetwork } = req.body;
    const update = {};
    if (theme !== undefined) update['preferences.theme'] = theme;
    if (defaultAlgorithm !== undefined) update['preferences.defaultAlgorithm'] = defaultAlgorithm;
    if (preferRoadNetwork !== undefined) update['preferences.preferRoadNetwork'] = !!preferRoadNetwork;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: update },
      { new: true, select: '-password' }
    );
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};