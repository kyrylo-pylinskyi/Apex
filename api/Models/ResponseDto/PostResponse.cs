namespace Apex.Models.ResponseDto
{
    public class PostResponse
    {
        public int? Id { get; set; }
        public string? Title { get; set; }
        public string? Content { get; set; }
        public string? Image { get; set; }
        public string? CreatedAt { get; set; }
        public int? CreatorId { get; set; }
        public string? CreatorName { get; set; }
        public string? CreatorPhoto { get; set; }
    }
}