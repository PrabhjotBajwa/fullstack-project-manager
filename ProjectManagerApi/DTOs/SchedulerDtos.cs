using System.ComponentModel.DataAnnotations;

namespace ProjectManagerApi.Dtos
{
    public class SchedulerRequestDto
    {
        [Required]
        public List<SchedulerTaskDto> Tasks { get; set; } = new List<SchedulerTaskDto>();
    }

    public class SchedulerTaskDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;
        public int EstimatedHours { get; set; }
        public DateTime? DueDate { get; set; }
        public List<string> Dependencies { get; set; } = new List<string>();
    }

    public class SchedulerResponseDto
    {
        public List<string> RecommendedOrder { get; set; } = new List<string>();
        public string? Error { get; set; }
    }
}