import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectMongo from '../../../database/conn'
import Users from '../../../model/Schema'
import { compare } from 'bcryptjs'

export const authOptions = {
    providers : [
        CredentialsProvider({
            name : "Credentials",
            async authorize(credentials, req){

                await connectMongo();

                // check user existance
                const result = await Users.findOne( { email : credentials.email})

                // compare(); same message for unknown email and wrong password
                const checkPassword = result ? await compare(credentials.password, result.password) : false;
                if(!checkPassword){
                    throw new Error("Email or password doesn't match");
                }

                return { id: result._id.toString(), name: result.username, email: result.email };
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt',
    }
}

export default NextAuth(authOptions)
