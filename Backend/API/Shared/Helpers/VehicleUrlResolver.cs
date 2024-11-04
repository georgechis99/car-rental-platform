using AutoMapper;
using Microsoft.Extensions.Configuration;
using Shared.Dtos;
using Shared.Entities;

namespace API.BusinessLayer.Helpers
{
    public class VehicleUrlResolver : IValueResolver<Vehicle, VehicleToReturnDto, string>
    {
        private readonly IConfiguration config;

        public VehicleUrlResolver(IConfiguration config)
        {
            this.config = config;
        }

        public string Resolve(Vehicle source, VehicleToReturnDto destination, string destMember, ResolutionContext context)
        {
            if (!string.IsNullOrEmpty(source.PictureUrl))
            {
                return config["ApiUrl"] + source.PictureUrl;
            }

            return null;
        }
    }
}
