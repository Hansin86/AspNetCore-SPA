using System.ComponentModel.DataAnnotations;

namespace AspNetCore_SPA.Controllers.Resources
{
    public class ContactResource 
    {
        [StringLength(255)]
        public string Email { get; set; }
        [Required]
        [StringLength(255)]
        public string Phone { get; set; }
        [Required]
        [StringLength(255)]
        public string Name { get; set; }
    }
}