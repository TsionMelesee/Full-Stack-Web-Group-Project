import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Req } from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { GetUser } from '../user/decorator/get-user.decorator';
import { User, UserType } from '@prisma/client';
import { UpdateJobDto } from './dto/update-job.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { RolesGuard } from '../auth/guards/role.guard';
import { Roles, UserRole } from '../auth/decorator/roles.decorator';

@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createJob(@Body() dto: CreateJobDto) {
    const userId = dto.createrId;

    if (!userId) {
      throw new NotFoundException('User ID not provided');
    }
    const user = await this.jobService.getUserById(userId);

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return this.jobService.createJob(userId, dto);
  }

  @Get('forEmployees')

  async getJobsForEmployees() {
    try {
      const jobs = await this.jobService.getJobsByUserType(UserType.EMPLOYEE);
      return { success: true, jobs };
    } catch (error) {
      return { error: 'An error occurred while fetching jobs for employees', success: false };
    }
  }

  @Get('forJobSeekers')
  
  async getJobsForJobSeekers() {
    try {
      const jobs = await this.jobService.getJobsByUserType(UserType.JOB_SEEKER);
      return { success: true, jobs };
    } catch (error) {
      return { error: 'An error occurred while fetching jobs for job seekers', success: false };
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteJob(@Param('id') jobId: string) {
    try {
      const result = await this.jobService.deleteJob(jobId);
      return { success: true, message: `Job with ID ${jobId} deleted successfully` };
    } catch (error) {
      return { error: `An error occurred while deleting job with ID ${jobId}`, success: false };
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateJob(@Param('id') jobId: string, @Body() updateJobDto: UpdateJobDto) {
    try {
      const updatedJob = await this.jobService.updateJob(jobId, updateJobDto);
      return { success: true, job: updatedJob };
    } catch (error) {
      return { error: `An error occurred while updating job with ID ${jobId}`, success: false };
    }
  }
  
  @Get('user-jobs/:userId')
  @UseGuards(JwtAuthGuard)
  async getUserJobs(@Param('userId') userId: string) {
    try {
      console.log(`Fetching jobs for user with ID: ${userId}`);
      const jobs = await this.jobService.getJobsByUserId(userId);
      console.log('Fetched jobs:', jobs);
      return { success: true, jobs };
    } catch (error) {
      console.error(`Error fetching jobs for user with ID ${userId}:`, error);
      return { error: `An error occurred while fetching jobs for user with ID ${userId}`, success: false };
    }
  }
  


  @Get('adminOnly')
  @Roles(UserRole.ADMIN)  
  @UseGuards(JwtAuthGuard, RolesGuard) 
  async adminOnlyRoute() {
    try {
      const jobs = await this.jobService.getAllJobs();
      return { jobs, success: true };
    } catch (error) {
      return { error: 'An error occurred while fetching jobs', success: false };
    }
  }
  
  
  @Get('getAllJobs')
  async getAllJobs() {
    try {
      const jobs = await this.jobService.getAllJobs();
      return { jobs, success: true };
    } catch (error) {
      return { error: 'An error occurred while fetching jobs', success: false };
    }
  }
}



