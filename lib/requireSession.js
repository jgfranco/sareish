import { getServerSession } from 'next-auth/next';
import { authOptions } from '../pages/api/auth/[...nextauth]';

// returns the session, or sends a 401 and returns null
export default async function requireSession(req, res) {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        res.status(401).json({ error: "Not authorized" });
        return null;
    }
    return session;
}
