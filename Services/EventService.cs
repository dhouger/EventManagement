using System;
using System.Collections.Generic;
using System.Linq;
using Event_Management.Infrastructure;
using Event_Management.Models;

namespace Event_Management.Services
{
    public class EventService : ServiceBase
	{
		protected static List<EventModel> EventList { get; }

		static EventService()
		{
			DateTime now = DateTime.Now;

			EventList = new List<EventModel>
			{
				new EventModel(1, new DateTime(now.Year, now.Month, now.Day - 1, 9, 0, 0), new TimeSpan(0, 15, 0),
								"Daily Standup", "Discuss indivisual tasks, progress, and blocking issues.",
								new List<PersonModel>
								{
									new PersonModel(1, "Ted", "Smith"),
									new PersonModel(2, "Fred", "Warsky"),
									new PersonModel(3, "John", "Foresyth"),
									new PersonModel(4, "Kumar", "Pakaar"),
									new PersonModel(5, "Will", "Tenpenny")
								}),
				new EventModel(2, new DateTime(now.Year, now.Month, now.Day, 9, 0, 0), new TimeSpan(0, 15, 0),
								"Daily Standup", "Discuss indivisual tasks, progress, and blocking issues.",
								new List<PersonModel>
								{
									new PersonModel(1, "Ted", "Smith"),
									new PersonModel(2, "Fred", "Warsky"),
									new PersonModel(3, "John", "Foresyth"),
									new PersonModel(4, "Kumar", "Pakaar"),
									new PersonModel(5, "Will", "Tenpenny")
								}),
				new EventModel(3, new DateTime(now.Year, now.Month, now.Day + 2, 14, 0, 0), new TimeSpan(1, 0, 0),
								"Client Meeting", "Skype Meeting",
								new List<PersonModel>
								{
									new PersonModel(1, "Ted", "Smith"),
									new PersonModel(2, "Brighid", "Kelley"),
									new PersonModel(3, "Valerio", "Maguire")
								}),
				new EventModel(4, new DateTime(now.Year, now.Month, now.Day + 2, 15, 0, 0), new TimeSpan(0, 30, 0),
								"Client Meeting Followup", "Room 402. User stories and post preliminary meeting discussions on requirements and deliverables.",
								new List<PersonModel>
								{
									new PersonModel(1, "Ted", "Smith"),
									new PersonModel(2, "Brighid", "Kelley"),
									new PersonModel(3, "Valerio", "Maguire")
								}),
				new EventModel(5, new DateTime(now.Year, now.Month, now.Day + 3, 12, 0, 0), new TimeSpan(0, 15, 0),
								"Team Get-together/Lunch", "It's Friday, Friday!",
								new List<PersonModel>
								{
									new PersonModel(1, "Ted", "Smith"),
									new PersonModel(2, "Brighid", "Kelley"),
									new PersonModel(3, "Valerio", "Maguire"),
									new PersonModel(4, "Fred", "Warsky"),
									new PersonModel(5, "John", "Foresyth"),
									new PersonModel(6, "Kumar", "Pakaar"),
									new PersonModel(7, "Will", "Tenpenny")
								})
			};
		}

		public virtual Result<List<EventModel>> Search(string term = null)
		{
			if (!string.IsNullOrEmpty(term))
			{
				term = term.ToLower();
				term = term.Trim();

				var result =
					EventList
					.Where(x =>
						x.Subject.ToLower().Contains(term)
					)
					.ToList();

				return Ok(result);
			}

			return Ok(EventList);
		}

		public virtual Result<int> Add(EventModel model)
		{
			if (model == null)
				return Error<int>();

			var newId = EventList.Max(x => x?.Id ?? 0) + 1;
			model.Id = newId;

			EventList.Add(model);

			return Ok(model.Id);
		}

		public virtual Result Update(EventModel model)
		{
			if (model == null)
				return Error();
			var ev = EventList.Where(x => x.Id == model.Id).FirstOrDefault();
			if (ev == null)
				return Error($"Event with id = {model.Id} not found.");

			var eventExists =
				EventList
				.Any(x =>
					x.Id != model.Id &&
					x.Subject == model.Subject
					);
			if (eventExists)
				return Error("Event with the same subject already exists");

			ev.EventStart = model.EventStart;
			ev.EventDuration = model.EventDuration;
			ev.Subject = model.Subject;
			ev.Description = model.Description;
			ev.Attendees = model.Attendees;

			return Ok();
		}

		public virtual Result Delete(int id)
		{
			var unit = EventList.Where(x => x.Id == id).FirstOrDefault();
			if (unit == null)
				return Error($"Can't find person with Id = {id}.");
			EventList.Remove(unit);
			return Ok();
		}
	}
}
