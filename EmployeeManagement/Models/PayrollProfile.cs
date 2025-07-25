using AutoMapper;

namespace EmployeeManagement.Models
{
    public class PayrollProfile : Profile
    {
        public PayrollProfile()
        {
            CreateMap<PayrollRecordDto, PayrollRecord>();
            CreateMap<PayrollRecord, PayrollRecordDto>();
        }
    }
}
