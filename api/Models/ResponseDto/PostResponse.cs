namespace Apex.Models.ResponseDto
{
    public class PostResponse
    {
        public int? Id { get; set; }
        public string? Title { get; set; }
        public string? Content { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int? CreatorId { get; set; }
    }
}