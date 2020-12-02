using System;
using System.Collections.Generic;
using Cassandra.Mapping;
using Cassandra.Mapping.Attributes;

namespace LeavesApi.Models
{

    // TODO can add later if there's more business logic needed
    // specify tablename, since our table is leaves not "leaf" as default assumes
    // https://docs.datastax.com/en/latest-csharp-driver-api/api/Cassandra.Mapping.Attributes.TableAttribute.html
    // https://stackoverflow.com/a/56734019/6952495
    [Table("leaves")]
    //public TableAttribute("leaves");
    public class Leaf
    {
        public string id { get; set; }
        public string title { get; set; }
        public string mimetype { get; set; }
        public string language { get; set; }
        public int? reading_time { get; set; }
        public int? is_archived { get; set; }
        public int? user_id { get; set; }
        public string url { get; set; }
        public string user_email { get; set; }
        public string user_name { get; set; }
        public string content { get; set; }
        public string content_text { get; set; }
        public string preview_picture { get; set; }
        public string domain_name { get; set; }
        public string http_status { get; set; }
        public int? is_starred { get; set; }
        public bool? is_public { get; set; }

        // TODO 
        public IEnumerable<string> all  { get; set; }

        public IEnumerable<string> tags { get; set; }
        public IEnumerable<string> slugs { get; set; }
        public IEnumerable<string> links { get; set; }

        public DateTimeOffset created_at { get; set; }
        public DateTimeOffset updated_at { get; set; }
        
    }
}