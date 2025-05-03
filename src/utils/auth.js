export function getUserFromToken(req) {
    const token = req.cookies.jwtToken || req.headers.authorization?.split(' ')[1];
    console.log('Token verification - cookies:', req.cookies);

    if (!token) {
      throw new Error('No token provided');
    }
  
    const arrayToken = token.split('.');
    const tokenPayload = JSON.parse(atob(arrayToken[1]));
    return {
      userId: tokenPayload.userId,
      email: tokenPayload.email
    };
  }