import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  if (!stored || !stored.includes('.')) {
    // If password format is invalid, return false
    console.warn('Invalid password format - missing salt');
    return false;
  }
  
  const [hashed, salt] = stored.split(".");
  if (!salt) {
    console.warn('Invalid password format - null salt after split');
    return false;
  }
  
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  // Enable console logging for development
  console.log("Setting up authentication...");
  
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || 'development-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax'
    }
  };

  console.log("Session settings:", JSON.stringify(sessionSettings, null, 2));

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      try {
        console.log(`Attempting login for email: ${email}`);
        
        // In development mode, always allow login for demo@example.com
        if (process.env.NODE_ENV === 'development' && email === 'demo@example.com') {
          console.log('Development mode: Bypassing password check for demo user');
          const demoUser = await storage.getUserByEmail(email);
          if (demoUser) {
            return done(null, demoUser);
          }
        }
        
        const user = await storage.getUserByEmail(email);
        
        if (!user) {
          console.log(`No user found with email: ${email}`);
          return done(null, false, { message: "Invalid credentials" });
        }
        
        const passwordMatch = await comparePasswords(password, user.password);
        console.log(`Password match for ${email}: ${passwordMatch}`);
        
        if (!passwordMatch) {
          return done(null, false, { message: "Invalid credentials" });
        }
        
        console.log(`Login successful for: ${email}`);
        return done(null, user);
      } catch (error) {
        console.error('Login error:', error);
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => {
    console.log(`Serializing user: ${user.id}`);
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id: number, done) => {
    try {
      console.log(`Deserializing user: ${id}`);
      const user = await storage.getUser(id);
      if (!user) {
        console.log(`No user found with id: ${id}`);
        return done(null, false);
      }
      console.log(`Found user: ${user.username}`);
      done(null, user);
    } catch (error) {
      console.error('Deserialization error:', error);
      done(error);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      console.log('Register request received:', req.body);
      
      if (!req.body.email || !req.body.password || !req.body.username) {
        console.log('Missing required fields');
        return res.status(400).json({ message: "Missing required fields" });
      }

      const existingUser = await storage.getUserByEmail(req.body.email);
      if (existingUser) {
        console.log(`Email already registered: ${req.body.email}`);
        return res.status(400).json({ message: "Email already registered" });
      }

      const hashedPassword = await hashPassword(req.body.password);
      const user = await storage.createUser({
        ...req.body,
        password: hashedPassword,
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      });

      console.log(`User created: ${user.id} (${user.username})`);

      await new Promise<void>((resolve, reject) => {
        req.login(user, (err) => {
          if (err) {
            console.error('Login after registration failed:', err);
            reject(err);
          } else {
            console.log('Login after registration successful');
            resolve();
          }
        });
      });
      
      console.log('Returning new user data to client');
      res.status(201).json({ 
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Registration failed" });
    }
  });

  app.post("/api/login", (req, res, next) => {
    console.log('Login request received:', req.body);
    
    passport.authenticate("local", (err: any, user: Express.User | false, info: { message: string } | undefined) => {
      if (err) {
        console.error('Authentication error:', err);
        return next(err);
      }
      
      if (!user) {
        console.log('Authentication failed:', info?.message);
        return res.status(401).json({ message: info?.message || "Authentication failed" });
      }
      
      req.login(user, (err) => {
        if (err) {
          console.error('Login error:', err);
          return next(err);
        }
        
        console.log(`User ${user.id} logged in successfully`);
        // Update last login and streak
        storage.updateUserStreak(user.id, (user.streak || 0) + 1);
        return res.json(user);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    console.log('Logout request received');
    req.logout((err) => {
      if (err) {
        console.error('Logout error:', err);
        return next(err);
      }
      console.log('Logout successful');
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    console.log('User information requested');
    if (!req.isAuthenticated()) {
      console.log('User not authenticated');
      return res.sendStatus(401);
    }
    console.log(`Returning user information for: ${req.user.id}`);
    res.json(req.user);
  });
}