import { NextFunction, Response, Request } from "express";
import db from "../db";
import { uuid } from 'uuidv4';
import { Session } from "../models/Session";

export async function signin(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body
    if (!username) {
        res.status(401).end()
        return
    }

    const expectedPassword = (await db.users.findOne({ username: username }))?.password;
    if (!expectedPassword || expectedPassword !== password) {
        res.status(401).end()
        return
    }

    const sessionToken = uuid()
    const now = new Date()
    const expiresAt = new Date(+now + 120 * 1000)
    const session = new Session(username, expiresAt, sessionToken);

    if(await db.sessions.findOne({ sessionToken: sessionToken })) {
        await db.sessions.updateOne( { sessionToken: sessionToken }, { $set: session }, { upsert: true} );
    } else {
        await db.sessions.insertOne(session);
    }
    res.cookie("token", sessionToken, { expires: expiresAt })
    res.status(200).end()

}

export async function authGuard(req: Request, res: Response, next: NextFunction) {
    if (!req.cookies) {
        res.status(401).end()
        return
    }

    const sessionToken = req.cookies['token']

    if (!sessionToken) {
        res.status(401).end();
        return;
    }

    const userSession = (await db.sessions.findOne({ sessionToken: sessionToken }));
    if (!userSession) {
        res.status(401).end()
        return
    }

    if (userSession.isExpired()) {
        await db.sessions.deleteOne({ sessionToken: sessionToken });
        res.status(401).end()
        return
    }

    next();
}

export async function signout(req: Request, res: Response, next: NextFunction) {
    if(!req.cookies || req.cookies['token']) {
        res.status(401).end()
        return
    }
    await db.sessions.deleteOne({ sessionToken: req.cookies['token'] });
    res.clearCookie("token");
    res.status(200).end();
}

export async function refresh(req: Request, res: Response) {
    if (!req.cookies) {
        res.status(401).end()
        return
    }

    const sessionToken = req.cookies['token']
    if (!sessionToken) {
        res.status(401).end()
        return
    }

    const userSession = (await db.sessions.findOne({ sessionToken: sessionToken }));
    if (!userSession) {
        res.status(401).end()
        return
    }
    if (userSession.isExpired()) {
        await db.sessions.deleteOne({ sessionToken: sessionToken });
        res.status(401).end()
        return
    }
    const newSessionToken = uuid()

    const now = new Date()
    const expiresAt = new Date(+now + 120 * 1000)
    const session = new Session(userSession.username, expiresAt, newSessionToken);

    await db.sessions.updateOne( { session: sessionToken }, { $set: session }, { upsert: true} );

    res.cookie("token", newSessionToken, { expires: expiresAt })
    res.status(200).end()
}