
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';


export function authenticate(req) {

  const token = req.headers.get('Authorization')?.split(' ')[1];


  if (!token) {
    return { success: false, message: 'Authentication required', status: 401 };
  }

  try {
 
    const decoded = jwt.verify(token, "wANfQv8JNbvgjwgV");
    req.user = decoded; 
    return { success: true }; 
  } catch (error) {
    return { success: false, message: 'Invalid token', status: 403 };
  }
}
