﻿using System;
using System.ComponentModel.DataAnnotations;

namespace KDOS_Web_API.Models.Domains
{
	public class HealthStatus
	{
        [Key]
        public int HealthStatusId { get; set; }
        required public DateTime Date { get; set; }
        required public string Status { get; set; }
        required public string Description { get; set; }
        // Relationship
        public int OrderDetailsId { get; set; }
        public OrderDetails OrderDetails { get; set; } = null!; // REQUIRED relationship
    }
}