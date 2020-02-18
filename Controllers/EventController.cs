using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Event_Management.Models;
using Event_Management.Services;

namespace Event_Management.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventController : ControllerBase
    {
		private EventService EventService { get; }

		public EventController(EventService eventService)
		{
			EventService = eventService;
		}

		[HttpGet("[action]")]
		public IActionResult Search([FromQuery]string term = null)
		{
			return Json(EventService.Search(term));
		}

		[HttpGet("[action]")]
		public IActionResult Add(EventModel model)
		{
			if (model == null)
				return BadRequest($"{nameof(model)} is null.");
			var result = EventService.Add(model);
			return Json(result);
		}

		[HttpGet("{id:int}")]
		public IActionResult Update(EventModel model)
		{
			if (model == null)
				return BadRequest($"{nameof(model)} is null.");
			var result = EventService.Update(model);
			return Json(result);
		}

		[HttpGet("{id:int}")]
		public IActionResult Delete(int id)
		{
			if (id <= 0)
				return BadRequest($"{nameof(id)} <= 0.");
			var result = EventService.Delete(id);
			return Json(result);
		}
    }
}
