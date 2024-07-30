import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UpdateJobDto } from './dto/update-job.dto';
import { UserType } from '@prisma/client';


@Injectable()
export class JobService {
  constructor(private db: PrismaService) {}

  async getUserById(userId: string) {
    return this.db.user.findUnique({
      where: { id: userId },
    });
  }

  async createJob(userId: string, dto: CreateJobDto) {
    const user = await this.getUserById(userId);
  
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  
    const job = await this.db.job.create({
      data: {
        createrId: userId,
        title: dto.title,
        description: dto.description,
        salary: dto.salary,
        userType: dto.userType,
       
      },
    });
  
    return job;
  }
  

  async getAllJobs() {
    const jobs = await this.db.job.findMany();
    return jobs;
  }

  async getJobsByUserType(userType: UserType) {
    const jobs = await this.db.job.findMany({
      where: {
        userType,
      },
    });

    return jobs;
  }
  

  async deleteJob(jobId: string) {
    const job = await this.db.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new NotFoundException(`Job with ID ${jobId} not found`);
    }

    const result = await this.db.job.delete({
      where: { id: jobId },
    });

    return result;
  }

  

  //Delete the jobs that are posted every 48 hours since every jobs are short-term jobs
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteExpiredJobs() {
    const fortyEightHoursAgo = new Date();
    fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - 48);

    const expiredJobs = await this.db.job.findMany({
      where: {
        createdAt: {
          lt: fortyEightHoursAgo,
        },
      },
    });

    for (const job of expiredJobs) {
      await this.db.job.delete({
        where: { id: job.id },
      });
    }
  }



  async updateJob(jobId: string, updateJobDto: UpdateJobDto) {
    const existingJob = await this.db.job.findUnique({
      where: { id: jobId },
    });

    if (!existingJob) {
      throw new NotFoundException(`Job with ID ${jobId} not found`);
    }
    const updatedJob = await this.db.job.update({
      where: { id: jobId },
      data: {
        title: updateJobDto.title || existingJob.title,
        description: updateJobDto.description || existingJob.description,
        salary: updateJobDto.salary || existingJob.salary,
        
      },
    });

    return updatedJob;
  }

  async getJobsByUserId(userId: string) {
    const jobs = await this.db.job.findMany({
      where: {
        createrId: userId,
      },
    });

    return jobs;
  }


  
}
