import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createYoga } from 'graphql-yoga';
import { PrismaClient } from '@prisma/client';
import { verifyAppToken } from './auth/middleware.js';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const app = express();

// CORS — allow the app's frontend origin
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
}));
app.use(helmet({ contentSecurityPolicy: false }));

// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// JWT auth middleware — validates app-scoped tokens from the platform
app.use((req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.slice(7);
        try {
            const payload = verifyAppToken(token);
            (req as any).user = payload;
        } catch {
            // Invalid token — continue as unauthenticated
        }
    }
    next();
});

// GraphQL endpoint
// TODO: Configure Pothos schema builder with your Prisma models
// import { schema } from './graphql/schema.js';
// For now, a simple placeholder schema
import { createSchema } from 'graphql-yoga';

const schema = createSchema({
    typeDefs: /* GraphQL */ `
    type Query {
      hello: String!
      items: [Item!]!
    }
    type Item {
      id: ID!
      name: String!
      createdBy: String!
      createdAt: String!
    }
  `,
    resolvers: {
        Query: {
            hello: () => 'Hello from {{APP_NAME}} API!',
            items: async () => {
                return prisma.item.findMany({ orderBy: { createdAt: 'desc' } });
            },
        },
    },
});

const yoga = createYoga({
    schema: schema as any,
    context: ({ request }) => ({
        user: (request as any).user ?? null,
        prisma,
    }),
    graphiql: true,
});

app.use('/graphql', yoga as any);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`API: http://localhost:${PORT}`);
    console.log(`GraphQL: http://localhost:${PORT}/graphql`);
    console.log(`Health: http://localhost:${PORT}/health`);
});
