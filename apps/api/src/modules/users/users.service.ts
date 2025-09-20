import { Injectable } from '@nestjs/common';
import { db } from '../../database/postgres/connection';
import { users } from '@gov-tech/db';
import { eq } from 'drizzle-orm';
import type { User, NewUser } from '@gov-tech/db';

@Injectable()
export class UsersService {
  async findByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0] as unknown as User | undefined;
  }

  async createUser(payload: NewUser): Promise<User> {
    const [created] = await db.insert(users).values(payload).returning();
    return created as unknown as User;
  }
}
