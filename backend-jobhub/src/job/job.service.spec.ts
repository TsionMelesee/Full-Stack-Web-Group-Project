import { Test, TestingModule } from '@nestjs/testing';
import { JobService } from './job.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { UserRole } from '@prisma/client';
import { UserType } from './dto/enums';

// Mock PrismaService
class MockPrismaService {
  job = {
    findUnique: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  };
  user = {
    findUnique: jest.fn(),
  };
}

describe('JobService', () => {
  let jobService: JobService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobService,
        { provide: PrismaService, useClass: MockPrismaService },
      ],
    }).compile();

    jobService = module.get<JobService>(JobService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('createJob', () => {
    it('should create a job successfully', async () => {
      const userId = '1';
      const createJobDto: CreateJobDto = {
        title: 'Software Engineer',
        description: 'Exciting job opportunity',
        salary: 80000,
        userType: UserType.EMPLOYEE,
        createrId: '',
      };
      const mockUser = {
        id: userId,
        username: 'mockUsername',
        email: 'mockEmail@example.com',
        hash: 'mockHash',
        userrole: UserRole.USER,
        password: 'mockPassword',
        name: 'mockName',
      };
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
      const mockCreatedJob = {
        id: 'mockJobId',
        createrId: userId,
        title: createJobDto.title,
        description: createJobDto.description,
        salary: createJobDto.salary !== undefined ? createJobDto.salary : null,
        userType: createJobDto.userType,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prismaService.job, 'create').mockResolvedValue(mockCreatedJob);
      const result = await jobService.createJob(userId, createJobDto);
      expect(result).toEqual(mockCreatedJob);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { id: userId } });
      expect(prismaService.job.create).toHaveBeenCalledWith({
        data: {
          createrId: userId,
          title: createJobDto.title,
          description: createJobDto.description,
          salary: createJobDto.salary,
          userType: createJobDto.userType,
        },
      });
    });

    it('should throw NotFoundException if user is not found during job creation', async () => {
      const userId = '2';
      const createJobDto: CreateJobDto = {
        title: 'Software Engineer',
        description: 'Exciting job opportunity',
        salary: 80000,
        userType: UserType.EMPLOYEE as UserType,
        createrId: '',
      };
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
      await expect(jobService.createJob(userId, createJobDto)).rejects.toThrowError(NotFoundException);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { id: userId } });
      expect(prismaService.job.create).not.toHaveBeenCalled();
    });
  });

  describe('deleteJob', () => {
    it('should delete a job successfully', async () => {
      const jobId = '1';
      const mockJob = {
        id: jobId,
        createrId: 'mockUserId',
        title: 'Software Engineer',
        description: 'Exciting job opportunity',
        salary: 80000,
        userType: UserType.EMPLOYEE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prismaService.job, 'findUnique').mockResolvedValue(mockJob);
      jest.spyOn(prismaService.job, 'delete').mockResolvedValue(mockJob);
      const result = await jobService.deleteJob(jobId);
      expect(result).toEqual(mockJob);
      expect(prismaService.job.findUnique).toHaveBeenCalledWith({ where: { id: jobId } });
      expect(prismaService.job.delete).toHaveBeenCalledWith({ where: { id: jobId } });
    });

    it('should throw NotFoundException if job is not found during deletion', async () => {
      const jobId = '2';
      jest.spyOn(prismaService.job, 'findUnique').mockResolvedValue(null);
      await expect(jobService.deleteJob(jobId)).rejects.toThrowError(NotFoundException);
      expect(prismaService.job.findUnique).toHaveBeenCalledWith({ where: { id: jobId } });
      expect(prismaService.job.delete).not.toHaveBeenCalled();
    });
  });



  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobService,
        { provide: PrismaService, useClass: MockPrismaService },
      ],
    }).compile();

    jobService = module.get<JobService>(JobService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('updateJob', () => {
    it('should update a job successfully', async () => {
      const jobId = '1';
      const updateJobDto: UpdateJobDto = {
        title: 'Updated Title',
        description: 'Updated Description',
        salary: 90000,
      };
  
      const mockExistingJob = {
        id: jobId,
        createrId: '1',
        title: 'Original Title',
        description: 'Original Description',
        salary: 80000,
        userType: UserType.EMPLOYEE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(prismaService.job, 'findUnique').mockResolvedValue(mockExistingJob);
      const mockUpdatedJob = {
        ...mockExistingJob,
        title: updateJobDto.title || mockExistingJob.title,
        description: updateJobDto.description || mockExistingJob.description,
        salary: updateJobDto.salary || mockExistingJob.salary,
        updatedAt: new Date(), 
      };
  
      jest.spyOn(prismaService.job, 'update').mockResolvedValue(mockUpdatedJob);
      const result = await jobService.updateJob(jobId, updateJobDto);
      expect(result).toEqual(mockUpdatedJob);
      expect(prismaService.job.findUnique).toHaveBeenCalledWith({ where: { id: jobId } });
      expect(prismaService.job.update).toHaveBeenCalledWith({
        where: { id: jobId },
        data: {
          title: updateJobDto.title || mockExistingJob.title,
          description: updateJobDto.description || mockExistingJob.description,
          salary: updateJobDto.salary || mockExistingJob.salary,
        },
      });
    });
  });
})  