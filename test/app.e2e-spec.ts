import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TodoStatus, User } from '@prisma/client';
import { EditUserDTO } from '../src/user/dto';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Todo App (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let prisma: PrismaService;
  let user: User;
  const userDTO: EditUserDTO = {
    email: 'mr_robertamoah@yahoo.com',
    password: '12345678',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.listen(3001);
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();

    prisma = app.get(PrismaService);
    await prisma.clean();
  });

  describe('User signup', () => {
    it('/auth/signup (POST)', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(userDTO)
        .expect(201);

      expect(res.body).toHaveProperty('access_token');
      expect(res.body.access_token).not.toBeNull();
    });
  });

  describe('User signin', () => {
    it('/auth/signin (POST)', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/signin')
        .send(userDTO)
        .expect(200);

      expect(res.body).toHaveProperty('access_token');
      expect(res.body.access_token).not.toBeNull();
      accessToken = res.body.access_token;
    });
  });

  describe('Get user', () => {
    it('/user (GET)', async () => {
      const res = await request(app.getHttpServer())
        .get('/user')
        .auth(accessToken, { type: 'bearer' })
        .expect(200);

      user = res.body;
      expect(user).toHaveProperty('id');
      expect(user.id).not.toBeNull();
    });
  });

  describe('User Editing', () => {
    it('/user (PATCH)', async () => {
      const data = { firstName: 'Robert', lastName: 'Amoah' };
      const res = await request(app.getHttpServer())
        .patch('/user')
        .send(data)
        .auth(accessToken, { type: 'bearer' })
        .expect(201);

      expect(res.body).toHaveProperty('firstName');
      expect(res.body).toHaveProperty('lastName');
      expect(res.body.firstName).toBe(data.firstName);
      expect(res.body.lastName).toBe(data.lastName);
    });
  });

  const todoDTO = { title: 'Create a file.', id: null };
  describe('Create Todo', () => {
    it('/todos (POST)', async () => {
      const res = await request(app.getHttpServer())
        .post('/todos')
        .send(todoDTO)
        .auth(accessToken, { type: 'bearer' })
        .expect(201);

      expect(res.body).toHaveProperty('title');
      expect(res.body.title).toBe(todoDTO.title);
      expect(res.body.status).toBe(TodoStatus.OPEN);
      expect(res.body.description).toBeNull();
      todoDTO.id = res.body.id;
    });
  });

  describe('Edit Todo', () => {
    it('/todos/:id (POST)', async () => {
      const description = 'i just want to create a file.';
      const res = await request(app.getHttpServer())
        .patch(`/todos/${todoDTO.id}`)
        .send({ description, status: TodoStatus.PENDING })
        .auth(accessToken, { type: 'bearer' })
        .expect(201);

      expect(res.body).toHaveProperty('title');
      expect(res.body.title).toBe(todoDTO.title);
      expect(res.body.status).toBe(TodoStatus.PENDING);
      expect(res.body.description).toBe(description);
    });
  });

  describe('Get Todo', () => {
    it('/todos/:id (GET)', async () => {
      const res = await request(app.getHttpServer())
        .get(`/todos/${todoDTO.id}`)
        .auth(accessToken, { type: 'bearer' })
        .expect(200);

      expect(res.body).toHaveProperty('title');
      expect(res.body.title).toBe(todoDTO.title);
      expect(res.body.status).toBe(TodoStatus.PENDING);
    });
  });

  describe('Get Todos', () => {
    it('/todos (GET)', async () => {
      const res = await request(app.getHttpServer())
        .get(`/todos`)
        .auth(accessToken, { type: 'bearer' })
        .expect(200);

      expect(res.body).toHaveLength(1);
    });
  });

  describe('Delete Todo', () => {
    it('/todos/:id (POST)', async () => {
      await request(app.getHttpServer())
        .delete(`/todos/${todoDTO.id}`)
        .auth(accessToken, { type: 'bearer' })
        .expect(204);
    });

    it('/todos (GET)', async () => {
      const res = await request(app.getHttpServer())
        .get(`/todos`)
        .auth(accessToken, { type: 'bearer' })
        .expect(200);

      expect(res.body).toHaveLength(0);
    });
  });

  afterAll(() => app.close());
});
