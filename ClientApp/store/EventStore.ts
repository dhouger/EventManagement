import { clone } from "@Utils";
import { Action, Reducer } from "redux"
import { AppThunkAction, AppThunkActionAsync } from "./index";
import EventService from "@Services/EventService";
import { IEventModel } from "@Models/IEventModel";
import { wait } from "domain-wait";
import Result from "@Models/Result";

export module EventStore {
	export interface IState {
		events: IEventModel[],
		indicators: {
			operationLoading: boolean;
		};
	}

	export enum Actions {
		FailureResponse = "EVENT_FAILURE_RESPONSE",
		SearchRequest = "EVENT_SEARCH_REQUEST",
		SearchResponse = "EVENT_SEARCH_RESPONSE",
		AddRequest = "EVENT_ADD_REQUEST",
		AddResponse = "EVENT_ADD_RESPONSE",
		UpdateRequest = "EVENT_UPDATE_REQUEST",
		UpdateResponse = "EVENT_UPDATE_RESPONSE",
		DeleteRequest = "EVENT_DELETE_REQUEST",
		DeleteResponse = "EVENT_DELETE_RESPONSE"
	}

	interface IFailureResponse {
		type: Actions.FailureResponse;
	}

	interface IGetAllRequest {
		type: Actions.SearchRequest;
	}

	interface IGetAllResponse {
		type: Actions.SearchResponse;
		payload: IEventModel[];
	}

	interface IAddRequest {
		type: Actions.AddRequest;
	}

	interface IAddResponse {
		type: Actions.AddResponse;
		payload: IEventModel;
	}

	interface IUpdateRequest {
		type: Actions.UpdateRequest;
	}

	interface IUpdateResponse {
		type: Actions.UpdateResponse;
		payload: IEventModel;
	}

	interface IDeleteRequest {
		type: Actions.DeleteRequest;
	}

	interface IDeleteResponse {
		type: Actions.DeleteResponse;
		id: number;
	}

	type KnownAction =
		IFailureResponse |
		IGetAllRequest | IGetAllResponse |
		IAddRequest | IAddResponse |
		IUpdateRequest | IUpdateResponse |
		IDeleteRequest | IDeleteResponse;

	export const actionCreators = {
		searchRequest: (term?: string): AppThunkAction<KnownAction> => async (dispatch, getState) => {

			await wait(async (transformUrl) => {

				// Wait for server prerendering.
				dispatch({ type: Actions.SearchRequest });

				var result = await EventService.search(term);

				if (!result.hasErrors) {
					dispatch({ type: Actions.SearchResponse, payload: result.value });
				} else {
					dispatch({ type: Actions.FailureResponse });
				}
			});
		},
		addRequest: (model: IEventModel): AppThunkActionAsync<KnownAction, Result<number>> => async (dispatch, getState) => {

			dispatch({ type: Actions.AddRequest });

			var result = await EventService.add(model);

			if (!result.hasErrors) {
				model.id = result.value;
				dispatch({ type: Actions.AddResponse, payload: model });
			} else {
				dispatch({ type: Actions.FailureResponse });
			}

			return result;
		},
		updateRequest: (model: IEventModel): AppThunkActionAsync<KnownAction, Result<{}>> => async (dispatch, getState) => {

			dispatch({ type: Actions.UpdateRequest });

			var result = await EventService.update(model);

			if (!result.hasErrors) {
				dispatch({ type: Actions.UpdateResponse, payload: model });
			} else {
				dispatch({ type: Actions.FailureResponse });
			}

			return result;
		},
		deleteRequest: (id: number): AppThunkAction<KnownAction> => async (dispatch, getState) => {

			dispatch({ type: Actions.DeleteRequest });

			var result = await EventService.delete(id);

			if (!result.hasErrors) {
				dispatch({ type: Actions.DeleteResponse, id });
			} else {
				dispatch({ type: Actions.FailureResponse });
			}
		}
	}

	const initialState: IState = {
		events: [],
		indicators: {
			operationLoading: false
		}
	};

	export const reducer: Reducer<IState> = (currentState: IState, incomingAction: Action) => {
		const action = incomingAction as KnownAction;

		var cloneIndicators = () => clone(currentState.indicators);

		switch (action.type) {
			case Actions.FailureResponse:
				var indicators = cloneIndicators();
				indicators.operationLoading = false;
				return { ...currentState, indicators };
			case Actions.SearchRequest:
				var indicators = cloneIndicators();
				indicators.operationLoading = true;
				return { ...currentState, indicators };
			case Actions.SearchResponse:
				var indicators = cloneIndicators();
				indicators.operationLoading = false;
				return { ...currentState, indicators, events: action.payload };
			case Actions.UpdateRequest:
				var indicators = cloneIndicators();
				indicators.operationLoading = true;
				return { ...currentState, indicators };
			case Actions.UpdateResponse:
				var indicators = cloneIndicators();
				indicators.operationLoading = false;
				var data = clone(currentState.events);
				var itemToUpdate = data.filter(x => x.id === action.payload.id)[0];
				itemToUpdate.eventStart = action.payload.eventStart;
				itemToUpdate.eventDuration = action.payload.eventDuration;
				itemToUpdate.subject = action.payload.subject;
				itemToUpdate.description = action.payload.description;
				itemToUpdate.attendees = action.payload.attendees;
				return { ...currentState, indicators, events: data };
			case Actions.AddRequest:
				var indicators = cloneIndicators();
				indicators.operationLoading = true;
				return { ...currentState, indicators };
			case Actions.AddResponse:
				var indicators = cloneIndicators();
				indicators.operationLoading = false;
				var data = clone(currentState.events);
				data.push(action.payload);
				return { ...currentState, indicators, events: data };
			case Actions.DeleteRequest:
				var indicators = cloneIndicators();
				indicators.operationLoading = true;
				return { ...currentState, indicators };
			case Actions.DeleteResponse:
				var indicators = cloneIndicators();
				indicators.operationLoading = false;
				var data = clone(currentState.events).filter(x => x.id !== action.id);
				return { ...currentState, indicators, events: data };
			default:
				// The following line guarantees that every action in the KnownAction union has been covered by a case above
				const exhaustiveCheck: never = action;
		}

		return currentState || initialState;
	}
}