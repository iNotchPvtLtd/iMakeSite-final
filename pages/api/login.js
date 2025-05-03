import iMakeSiteUsers from '../../src/models/iMakeSiteUsers';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import dbConnect from '../../src/utils/dbConnect';

export default async function handler(req, res) {
  console.log('Login API called'); // Add thi
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

 

    console.log('Database connected');
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

    // Find user
    let user = await iMakeSiteUsers.findOne({ email });
    console.log('Found user:', user ? 'Yes' : 'No');

    // Auto-register user if not found
    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await iMakeSiteUsers.create({ email, password: hashedPassword, createdAt: new Date() });
      console.log('New user created:', user._id);
    } else {
      // Verify password for existing user
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
      console.log('Password verified successfully');
    }

    console.log(' user._id.toString()...', user._id.toString());

    // Create token
    const token = jwt.sign(
      { 
        userId:user._id.toString(),
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    console.log('JWT token created',token);

    const cookieOptions = {
      httpOnly: false, // Change to false so client-side JS can read it
      secure: false, // Change to false for development
      sameSite: 'lax', // Change to lax for better compatibility
      maxAge: 86400000,
      path: '/',
    };

    res.setHeader(
      'Set-Cookie', 
      serialize('jwtToken', token, cookieOptions)
    );

    // // Set cookie
    // res.setHeader(
    //   'Set-Cookie',
    //   `jwtToken=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400; Domain=${process.env.NODE_ENV === 'development' ? 'localhost' : process.env.DOMAIN}`
    // );

    console.log('Cookie set');


    console.log('Login successful for user:', user.email);
    res.status(200).json({ 
      success: true,
      user: {
        userId: user._id.toString(),
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}