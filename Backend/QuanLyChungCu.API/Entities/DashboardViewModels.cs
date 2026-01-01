using System.Collections.Generic; // Cần dòng này để dùng List<>

namespace QuanLyChungCu.API.Entities 
{
    // Class cha bao bọc tất cả (để khớp với Controller)
    public class DashboardViewModels
    {
        // 1. Class tổng
        public class DashboardResponse
        {
            public List<MemberDto> Members { get; set; }
            public List<FeeDto> UnpaidFees { get; set; }
            public List<FeeDto> PaidFees { get; set; }
            public List<VehicleDto> Vehicles { get; set; }
            public List<NoticeDto> Notices { get; set; }
        }

        // 2. Các class con
        public class MemberDto
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public string Avatar { get; set; } 
            public string Role { get; set; }   
        }

        public class FeeDto
        {
            public int Id { get; set; }
            public string Title { get; set; }  
            public decimal Amount { get; set; }
            public string Date { get; set; }   
        }

        public class VehicleDto
        {
            public int Id { get; set; }
            public string Plate { get; set; }  
            public string Type { get; set; }   
            public string Status { get; set; } 
        }

        public class NoticeDto
        {
            public int Id { get; set; }
            public string Title { get; set; }
            public string Date { get; set; }
            public bool Urgent { get; set; }   
        }
    }
}