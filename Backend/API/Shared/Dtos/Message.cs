using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Dtos
{
    public class Message
    {
        public Message(HttpStatusCode code, string name, string description)
        {
            this.Code = code;
            this.Name = name;
            this.Description = description;
        }

        public HttpStatusCode Code { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }
    }
}
