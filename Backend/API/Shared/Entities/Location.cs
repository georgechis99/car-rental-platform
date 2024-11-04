namespace Shared.Entities
{
    public class Location : BaseEntity
    {
        /// <summary>
        /// Ex: Cluj Avram Iancu International Airport (CLJ)
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Ex: Cluj-Napoca, Cluj, Romania
        /// </summary>
        public string Address { get; set; }
    }
}