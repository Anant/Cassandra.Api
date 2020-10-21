namespace LeavesApi.Models
{
    // TODO can add later if there's more business logic needed
    public class Leaf
    {
        public string id { get; set; }
        public string title { get; set; }
        public string mimetype { get; set; }
        public string language { get; set; }
        public int reading_time { get; set; }
        public int is_archived { get; set; }
        public int user_id { get; set; }
        public string url { get; set; }
        public string user_email { get; set; }
        public string user_name { get; set; }
        public string content { get; set; }
        public string content_text { get; set; }
        public string preview_picture { get; set; }
        public string domain_name { get; set; }
        public string http_status { get; set; }
        public int is_starred { get; set; }
        public bool is_public { get; set; }

        // TODO 
        // all list<text>, 

        // tags list<text>, 
        // slugs list<text>, 


        // created_at timestamp, 
        // updated_at timestamp, 
        // links list<text>
    }
}