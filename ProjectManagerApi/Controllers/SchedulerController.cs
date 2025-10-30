using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectManagerApi.Data;
using ProjectManagerApi.Dtos;
using ProjectManagerApi.Services;

namespace ProjectManagerApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/v1/projects/{projectId}")]
    public class SchedulerController : ControllerBase
    {
        private readonly SchedulerService _schedulerService;
        private readonly ApplicationDbContext _context;

        public SchedulerController(SchedulerService schedulerService, ApplicationDbContext context)
        {
            _schedulerService = schedulerService;
            _context = context;
        }

        [HttpPost("schedule")]
        public async Task<ActionResult<SchedulerResponseDto>> GetSchedule(Guid projectId, SchedulerRequestDto request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var project = await _context.Projects
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Id == projectId && p.OwnerId == userId);
                
            if (project == null)
            {
                return Forbid();
            }

            try
            {
                var order = _schedulerService.GetSchedule(request.Tasks);
                return Ok(new SchedulerResponseDto { RecommendedOrder = order });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new SchedulerResponseDto { Error = ex.Message });
            }
        }
    }
}