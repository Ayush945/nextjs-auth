import { connect } from "@/dbConfig/dbConfig";
import User from '@/models/userModel'
import {NextRequest,NextResponse}  from 'next/server'
import bcryptjs from 'bcryptjs'
import { sendEmail } from "@/helpers/mailer";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect()

export async function POST(request:NextRequest) {
    try {
        const userId=await getDataFromToken(request)
        const user=await User.findOne({_id:userId}).select("-password")

        if(!user){
            return NextResponse.json({message:"User not found"},{status:400})
        }

        return NextResponse.json({
            message:"User found",
            data:user
        })

    } catch (error:any) {
        return NextResponse.json({error:error.message},{status:500})
    }
}