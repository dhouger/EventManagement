﻿using System;

namespace Event_Management
{
	public class AppSettings
	{
		public static AppSettings Default { get; }

		protected AppSettings()
		{
		}

		static AppSettings()
		{
			Default = new AppSettings();
		}

		public bool IsDevelopment =>
			Environment.GetEnvironmentVariables()["ASPNETCORE_ENVIRONMENT"]?.ToString() == "Development";
	}
}
