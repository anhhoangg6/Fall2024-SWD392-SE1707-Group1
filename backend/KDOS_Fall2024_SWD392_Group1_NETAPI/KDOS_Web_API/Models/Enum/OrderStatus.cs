﻿using System.Runtime.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters; 

namespace KDOS_Web_API.Models.Enum
{
    [JsonConverter(typeof(StringEnumConverter))]
    public enum OrderStatus
    {
        [EnumMember(Value = "PENDING")] //Cho xu ly
        PENDING,

        [EnumMember(Value = "PROCESSING")] //Dang delivery
        PROCESSING,

        [EnumMember(Value = "DELIVERED")] //Da giao hang
        DELIVERED,

        [EnumMember(Value = "CANCELLED")] //Huy
        CANCELLED
    }
}
