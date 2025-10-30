using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectManagerApi.Data;
using ProjectManagerApi.Dtos;
using ProjectManagerApi.Models;

namespace ProjectManagerApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api")]
    public class TasksController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TasksController(ApplicationDbContext context)
        {
            _context = context;
        }

        private string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!; // Fix

        private async Task<bool> IsProjectOwner(Guid projectId)
        {
            var project = await _context.Projects
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Id == projectId && p.OwnerId == GetUserId());
            return project != null;
        }

        [HttpPost("projects/{projectId}/tasks")]
        public async Task<ActionResult<TaskDto>> CreateTask(Guid projectId, CreateTaskDto createDto)
        {
            if (!await IsProjectOwner(projectId))
            {
                return Forbid();
            }

            var task = new TaskItem
            {
                Title = createDto.Title,
                DueDate = createDto.DueDate,
                IsCompleted = false,
                ProjectId = projectId
            };

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTask), new { taskId = task.Id }, new TaskDto
            {
                Id = task.Id,
                Title = task.Title,
                DueDate = task.DueDate,
                IsCompleted = task.IsCompleted,
                ProjectId = task.ProjectId
            });
        }

        [HttpPut("tasks/{taskId}")]
        public async Task<IActionResult> UpdateTask(Guid taskId, UpdateTaskDto updateDto)
        {
            var task = await _context.Tasks
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.Id == taskId);

            if (task == null)
            {
                return NotFound();
            }

            if (task.Project.OwnerId != GetUserId())
            {
                return Forbid();
}

            task.Title = updateDto.Title;
            task.DueDate = updateDto.DueDate;
            task.IsCompleted = updateDto.IsCompleted;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("tasks/{taskId}")]
        public async Task<IActionResult> DeleteTask(Guid taskId)
        {
            var task = await _context.Tasks
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.Id == taskId);
            
            if (task == null)
            {
                return NotFound();
            }

            if (task.Project.OwnerId != GetUserId())
            {
                return Forbid();
            }

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
            return NoContent();
        }
        
        [HttpGet("tasks/{taskId}")] // Added this endpoint as it was referenced in CreateTask
        public async Task<ActionResult<TaskDto>> GetTask(Guid taskId)
        {
             var task = await _context.Tasks
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.Id == taskId);
            
            if (task == null) return NotFound();
            if (task.Project.OwnerId != GetUserId()) return Forbid();

            return Ok(new TaskDto 
            {
                Id = task.Id,
                Title = task.Title,
                DueDate = task.DueDate,
                IsCompleted = task.IsCompleted,
                ProjectId = task.ProjectId
            });
        }
    }
}