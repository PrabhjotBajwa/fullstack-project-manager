using System.ComponentModel.DataAnnotations;

namespace ProjectManagerApi.Models
{
    public class Project
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime CreationDate { get; set; }

        public string OwnerId { get; set; } = string.Empty;
        public User Owner { get; set; } = null!;

        public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
    }
}