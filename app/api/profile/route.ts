import { NextResponse, NextRequest } from 'next/server';
import { verifyToken } from '@/utils/jwtHandler';
import ProfileModel from '@/model/profile/profileModel';
import connectToDb from '@/utils/database/connectToDb';
import { z } from 'zod';

// Define the valid programming subjects
const ProgrammingSubjects = [
  'JavaScript',
  'Python',
  'Java',
  'C++',
  'Ruby',
  'Go',
  'TypeScript',
  'PHP',
  'C#',
  'Swift',
  'Rust',
  'Kotlin',
] as const;

type Subject = typeof ProgrammingSubjects[number]; // TypeScript type for subjects

// Define the validation schema with Zod
const profileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  country: z.string().min(1, 'Country is required'),
  subjects: z
    .array(z.enum(ProgrammingSubjects))
    .min(1, 'At least one subject must be selected')
    .max(5, 'You can select a maximum of 5 subjects'),
});

export async function POST(req: NextRequest) {
  try {
    // Extract Authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: No token provided' },
        { status: 401 }
      );
    }

    // Get the token
    const token = authHeader.split(' ')[1];

    // Verify the token
    let decoded;
    
      decoded = await verifyToken(token); // Use the utility function

      

    // Extract userId from decoded token
    const userId = decoded.id;
    console.log("userId",userId);

    // Parse request body
    const body = await req.json();

    // Validate input using Zod
    const validationResult = profileSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, message: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { fullName, country, subjects } = validationResult.data;

    // Connect to MongoDB
    await connectToDb();

    // Create a new profile
    const newProfile = await ProfileModel.create({
      fullName,
      country,
      userId,
      subjects, // Save subjects array
    });

    // Respond with the newly created profile
    return NextResponse.json({ success: true, profile: newProfile }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating profile:', error);
    return NextResponse.json(
      { success: false, message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}
export async function GET(req: NextRequest) {
  try {
    // Get the token from headers or cookies
    const token = req.headers.get('Authorization')?.split(' ')[1]; // Assuming the token is passed in the Authorization header

    if (!token) {
      return NextResponse.json({ message: 'Token is required' }, { status: 401 });
    }

    // Verify token and extract userId
    const decoded = verifyToken(token);
    const userId = decoded.id; // Assuming the token payload contains 'id' (userId)

    // Fetch user profile from the database
    const profile = await ProfileModel.findOne({ userId });

    if (!profile) {
      return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/profiles/self:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}