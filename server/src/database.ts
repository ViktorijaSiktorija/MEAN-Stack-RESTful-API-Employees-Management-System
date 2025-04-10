import * as mongodb from 'mongodb';
import { Employee } from './employee';
import { User } from './user';
import { error } from 'console';

export const collections: {
  employees?: mongodb.Collection<Employee>;
  users?: mongodb.Collection<User>;
} = {};

export async function connectToDatabase(uri: string) {
  const client = new mongodb.MongoClient(uri);
  await client.connect();
  console.log(await client.db().listCollections().toArray());

  const db = client.db('meanStackExample');
  await applySchemaValidationEmployee(db);
  await applySchemaValidationUser(db);

  const employeesCollection = db.collection<Employee>('employees');
  const usersCollection = db.collection<User>('users');
  collections.employees = employeesCollection;
  collections.users = usersCollection;
}

async function applySchemaValidationEmployee(db: mongodb.Db) {
  const jsonSchema = {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'position', 'level'],
      additionalProperties: false,
      properties: {
        _id: {},
        name: {
          bsonType: 'string',
          description: "'name' is required and is a string",
        },
        position: {
          bsonType: 'string',
          description: "'position' is required and is a string",
          minLength: 5,
        },
        level: {
          bsonType: 'string',
          description:
            "'level' is required and is one of 'junior', 'mid', or 'senior'",
          enum: ['junior', 'mid', 'senior'],
        },
      },
    },
  };
  await db
    .command({
      collMod: 'employees',
      validator: jsonSchema,
    })
    .catch(async (error: mongodb.MongoServerError) => {
      if (error.codeName === 'NamespaceNotFound') {
        await db.createCollection('employees', { validator: jsonSchema });
      }
    });
}

async function applySchemaValidationUser(db: mongodb.Db) {
  const jsonSchema = {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'email', 'password'],
      additionalProperties: false,
      properties: {
        _id: {},
        name: {
          bsonType: 'string',
          description: "'name' is required and is a string",
        },
        email: {
          bsonType: 'string',
          description: "'email' is required and is a string",
          minLength: 5,
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
        },
        password: {
          bsonType: 'string',
          description: "'password' is required and is a string",
          minLength: 5,
        },
      },
    },
  };
  await db
    .command({
      collMod: 'users',
      validator: jsonSchema,
    })
    .catch(async (error: mongodb.MongoServerError) => {
      if (error.codeName === 'NamespaceNotFound') {
        await db.createCollection('users', { validator: jsonSchema });
      }
    });
}
