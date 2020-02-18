import { IPersonModel } from "./IPersonModel";

export interface IEventModel {
	id?: number;
	eventStart?: Date;
	eventDuration?: number;
	subject?: string;
	description?: string;
	attendees?: IPersonModel[];
}