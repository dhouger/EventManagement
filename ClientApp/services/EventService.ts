import { ServiceBase } from "@Services/ServiceBase";
import Result from "@Models/Result";
import { IEventModel } from "@Models/IEventModel";

export default class EventService extends ServiceBase {
	public static async search(term: string = null): Promise<Result<IEventModel[]>> {
		if (term == null) {
			term = "";
		}
		var result = await this.requestJson<IEventModel[]>({
			url: `/api/Event/Search?term=${term}`,
			method: "GET"
		});
		return result;
	}
	public static async update(model: IEventModel): Promise<Result<{}>> {
		var result = await this.requestJson({
			url: `/api/Event/${model.id}`,
			method: "PATCH",
			data: model
		});
		return result;
	}
	public static async delete(id: number): Promise<Result<{}>> {
		var result = await this.requestJson({
			url: `/api/Event/${id}`,
			method: "DELETE"
		});
		return result;
	}
	public static async add(model: IEventModel): Promise<Result<number>> {
		var result = await this.requestJson<number>({
			url: "/api/Event/Add",
			method: "POST",
			data: model
		});
		return result;
	}
}