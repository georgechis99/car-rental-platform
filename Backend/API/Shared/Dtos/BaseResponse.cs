using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Shared.Dtos
{
    public class BaseResponse
    {
        public bool IsValid => !this.Errors.Any();

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public virtual IList<Message> Errors { get; set; } = new List<Message>();

        public BaseResponse AddError(HttpStatusCode errorCode, string errorName, string errorMessage)
        {
            this.Errors.Add(new Message(errorCode, errorName, errorMessage));
            return this;
        }

        public BaseResponse AddError(Message errorMessage)
        {
            this.Errors.Add(errorMessage);
            return this;
        }

        public void AddError(IList<Message> errors)
        {
            var groupByProperty = errors.GroupBy(gr => gr.Name).Select(gr =>
            new
            {
                gr.Key,
                Errors = gr.Select(g => g),
            });
            foreach (var error in groupByProperty)
            {
                this.Errors = this.Errors.Concat(error.Errors).ToList();
            }
        }
    }
}
