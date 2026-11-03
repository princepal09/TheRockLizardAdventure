import type { Request, Response } from 'express';
import { AppError } from '../../utils/common/error/AppError.js';
import { catchAsync } from '../../utils/common/helpers/CathAsync.js';
import { sendResponse } from '../../utils/response/AppResponse.js';
import { teamMemberIdSchema } from './team.schema.js';
import type { TeamService } from './team.service.js';

export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  getActiveMembersController = catchAsync(async (_req: Request, res: Response) => {
    const members = await this.teamService.getMembers(true);
    sendResponse(res, 200, {
      success: true,
      message: 'Team members fetched successfully',
      data: members,
    });
  });

  getMembersController = catchAsync(async (_req: Request, res: Response) => {
    const members = await this.teamService.getMembers();
    sendResponse(res, 200, {
      success: true,
      message: 'Team members fetched successfully',
      data: members,
    });
  });

  getMemberController = catchAsync(async (req: Request, res: Response) => {
    const member = await this.teamService.getMember(this.parseMemberId(req.params.memberId));
    sendResponse(res, 200, {
      success: true,
      message: 'Team member fetched successfully',
      data: member,
    });
  });

  createMemberController = catchAsync(async (req: Request, res: Response) => {
    const member = await this.teamService.createMember(req.body, req.file);
    sendResponse(res, 201, {
      success: true,
      message: 'Team member created successfully',
      data: member,
    });
  });

  updateMemberController = catchAsync(async (req: Request, res: Response) => {
    const member = await this.teamService.updateMember(
      this.parseMemberId(req.params.memberId),
      req.body,
      req.file,
    );
    sendResponse(res, 200, {
      success: true,
      message: 'Team member updated successfully',
      data: member,
    });
  });

  deleteMemberController = catchAsync(async (req: Request, res: Response) => {
    await this.teamService.deleteMember(this.parseMemberId(req.params.memberId));
    sendResponse(res, 200, { success: true, message: 'Team member deleted successfully' });
  });

  private parseMemberId(value: unknown): string {
    const result = teamMemberIdSchema.safeParse(value);
    if (!result.success) throw new AppError('Invalid team member ID', 400);
    return result.data;
  }
}
