using System;
using System.Collections.Generic;

namespace Event_Management.Models
{
	public class EventModel
	{
		public int Id;
		public DateTime EventStart;
		public TimeSpan EventDuration;
		public string Subject;
		public string Description;
		public List<PersonModel> Attendees;

		public EventModel(int id, DateTime eventStart, TimeSpan eventDuration, string subject, string desc, List<PersonModel> attendees)
		{
			Id = id;
			EventStart = eventStart;
			EventDuration = eventDuration;
			Subject = subject;
			Description = desc;
			Attendees = attendees;
		}

		public EventModel()
		{

		}
	}
}