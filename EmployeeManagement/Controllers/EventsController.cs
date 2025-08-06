using System.Threading.Tasks;
using EmployeeManagement.Data;
using EmployeeManagement.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Nager.Holiday;

namespace EmployeeManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EventsController(AppDbContext context)
        {
            _context = context;
        }
        /*
        [NonAction]
        public async Task<List<HolidayDto>> GetBangladeshHolidays(int year)
        {
            var holidayClient = new HolidayClient();
            var holidays = await holidayClient.GetHolidaysAsync(year, "bd");

            return holidays.Select(h => new HolidayDto
            {
                LocalName = h.LocalName,
                Date = h.Date
            }).ToList();
        }
        */

        private List<HolidayDto> GetBangladeshHolidays(int year)
        {
            return new List<HolidayDto>
            {
                new HolidayDto { LocalName = "Shab e-Barat", Date = new DateTime(year, 2, 15) },
                new HolidayDto { LocalName = "International Mother Language Day", Date = new DateTime(year, 2, 21) },
                new HolidayDto { LocalName = "Independence Day", Date = new DateTime(year, 3, 26) },
                new HolidayDto { LocalName = "Laylat al-Qadr", Date = new DateTime(year, 3, 27) },
                new HolidayDto { LocalName = "Eid-ul-Fitr", Date = new DateTime(year, 3, 29) },
                new HolidayDto { LocalName = "Eid-ul-Fitr", Date = new DateTime(year, 3, 30) },
                new HolidayDto { LocalName = "Eid-ul-Fitr", Date = new DateTime(year, 3, 31) },
                new HolidayDto { LocalName = "Eid-ul-Fitr", Date = new DateTime(year, 4, 1)},
                new HolidayDto { LocalName = "Eid-ul-Fitr", Date = new DateTime(year, 4, 2)},
                new HolidayDto { LocalName = "Pohela Baishak", Date = new DateTime(year, 4, 14) },
                new HolidayDto { LocalName = "May Day", Date = new DateTime(year, 5, 1) },
                new HolidayDto { LocalName = "Budha Purnima", Date = new DateTime(year, 5, 11) },
                new HolidayDto { LocalName = "Eid-ul-Adha", Date = new DateTime(year, 6, 5) },
                new HolidayDto { LocalName = "Eid-ul-Adha", Date = new DateTime(year, 6, 6) },
                new HolidayDto { LocalName = "Eid-ul-Adha", Date = new DateTime(year, 6, 7) },
                new HolidayDto { LocalName = "Eid-ul-Adha", Date = new DateTime(year, 6, 8) },
                new HolidayDto { LocalName = "Eid-ul-Adha", Date = new DateTime(year, 6, 9) },
                new HolidayDto { LocalName = "Eid-ul-Adha", Date = new DateTime(year, 6, 10) },
                new HolidayDto { LocalName = "Ashura", Date = new DateTime(year, 7, 6) },
                new HolidayDto { LocalName = "Janmashtami", Date = new DateTime(year, 8, 16) },
                new HolidayDto { LocalName = "Eid-e-Miladun-Nabi", Date = new DateTime(year, 9, 5) },
                new HolidayDto { LocalName = "Bijaya Dashami", Date = new DateTime(year, 10, 2) },
                new HolidayDto { LocalName = "Victory Day", Date = new DateTime(year, 12, 16) },
                new HolidayDto { LocalName = "Christmas Day", Date = new DateTime(year, 12, 25) }
            };
        }

        [HttpGet("calendar")]
        public async Task<IActionResult> GetCalendarEvents([FromQuery] int year, [FromQuery] int month)
        {
            var holidays = GetBangladeshHolidays(year)
                .Where(h => h.Date.Month == month);
            //var monthlyHolidays = holidays.Where(h => h.Date.Month == month);

            var dbEvents = await _context.Events
                .Where(e => e.Date.Year == year && e.Date.Month == month)
                .Select(e => new HolidayDto
                {
                    LocalName = e.LocalName,
                    Date = e.Date
                })
                .ToListAsync();

            var allEvents = holidays.Concat(dbEvents)
                                    .OrderBy(e => e.Date)
                                    .ToList();

            return Ok(allEvents);
        }

        [HttpGet("holidays")]
        public async Task<IActionResult> GetYearlyHolidays([FromQuery] int year)
        {
            var holidays = GetBangladeshHolidays(year);
            //var monthlyHolidays = holidays.Where(h => h.Date.Month == month);
            /*
            var dbEvents = await _context.Events
                .Where(e => e.Date.Year == year)
                .Select(e => new HolidayDto
                {
                    LocalName = e.LocalName,
                    Date = e.Date
                })
                .ToListAsync();

            var allEvents = holidays.Concat(dbEvents)
                                    .OrderBy(e => e.Date)
                                    .ToList();
            */
            return Ok(holidays);
        }

        [HttpGet("allEvents")]
        public async Task<IActionResult> GetAllEvents(int year)
        {
            var allEvents = await _context.Events
                .Where(e => e.Date.Year == year)
                .ToListAsync();

            return Ok(allEvents);
        }

        [HttpPost]
        public async Task<IActionResult> SetCalendarEvents([FromBody] Event events)
        {
            _context.Events.Add(events);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetCalendarEvents), new { date = events.Date }, events);
        }


    }
}
