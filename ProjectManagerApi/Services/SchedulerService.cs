using ProjectManagerApi.Dtos;

namespace ProjectManagerApi.Services
{
    public class SchedulerService
    {
        public List<string> GetSchedule(List<SchedulerTaskDto> tasks)
        {
            var adj = new Dictionary<string, List<string>>();
            var inDegree = new Dictionary<string, int>();
            var taskTitles = tasks.Select(t => t.Title).ToList();

            foreach (var task in tasks)
            {
                inDegree[task.Title] = 0;
                adj[task.Title] = new List<string>();
            }

            foreach (var task in tasks)
            {
                foreach (var dep in task.Dependencies)
                {
                    if (taskTitles.Contains(dep) && adj.ContainsKey(dep))
                    {
                        adj[dep].Add(task.Title);
                        inDegree[task.Title]++;
                    }
                }
            }

            var queue = new Queue<string>();
            foreach (var taskTitle in inDegree.Keys)
            {
                if (inDegree[taskTitle] == 0)
                {
                    queue.Enqueue(taskTitle);
                }
            }

            var sortedOrder = new List<string>();
            while (queue.Count > 0)
            {
                var current = queue.Dequeue();
                sortedOrder.Add(current);

                foreach (var neighbor in adj[current])
                {
                    inDegree[neighbor]--;
                    if (inDegree[neighbor] == 0)
                    {
                        queue.Enqueue(neighbor);
                    }
                }
            }

            if (sortedOrder.Count != tasks.Count)
            {
                throw new InvalidOperationException("A cycle was detected in the task dependencies.");
            }

            return sortedOrder;
        }
    }
}