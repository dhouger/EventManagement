import "@Styles/main.scss";
import * as React from "react";
import { Helmet } from "react-helmet";
import { RouteComponentProps, withRouter } from "react-router";
import { IEventModel } from "@Models/IEventModel";
import { EventStore } from "@Store/EventStore";
import { ApplicationState, reducers } from "@Store/index";
import { connect } from "react-redux";
import { PagingBar } from "@Components/shared/PagingBar";
import EventEditor from "@Components/event/EventEditor";
import Loader from "@Components/shared/Loader";
import bind from 'bind-decorator';
import { ModalComponent } from "@Components/shared/ModalComponent";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import { getPromiseFromAction } from "@Utils";

type Props = RouteComponentProps<{}> & typeof EventStore.actionCreators & EventStore.IState;

interface IState {
	searchTerm: string;
	pageNum: number;
	limitPerPage: number;
	rowOffset: number;
	modelForEdit: IEventModel;
}

class EventPage extends React.Component<Props, IState> {

	private pagingBar: PagingBar;

	private elModalAdd: ModalComponent;
	private elModalEdit: ModalComponent;
	private elModalDelete: ModalComponent;

	private eventEditorAdd: EventEditor;
	private eventEditorEdit: EventEditor;

	private debouncedSearch: (term: string) => void;

	constructor(props: Props) {
		super(props);

		this.state = {
			searchTerm: "",
			pageNum: 1,
			limitPerPage: 5,
			rowOffset: 0,
			modelForEdit: {}
		};

		this.debouncedSearch = AwesomeDebouncePromise((term: string) => {
			props.searchRequest(term);
		}, 500);
	}

	componentWillMount() {
		this.props.searchRequest();
	}

	componentWillUnmount() {
		if (this.elModalAdd) {
			this.elModalAdd.hide();
		}
		if (this.elModalEdit) {
			this.elModalEdit.hide();
		}
		if (this.elModalDelete) {
			this.elModalDelete.hide();
		}
	}

	@bind
	onChangePage(pageNum: number): void {
		let rowOffset = Math.ceil((pageNum - 1) * this.state.limitPerPage);
		this.setState({ pageNum, rowOffset });
	}

	@bind
	onClickShowAddModal(e: React.MouseEvent<HTMLButtonElement>) {
		this.elModalAdd.show();
	}

	@bind
	onClickShowEditModal(e: React.MouseEvent<HTMLButtonElement>, modelForEdit: IEventModel) {
		this.setState({ modelForEdit });
		this.elModalEdit.show();
	}

	@bind
	onClickShowDeleteModal(e: React.MouseEvent<HTMLButtonElement>, modelForEdit: IEventModel) {
		this.setState({ modelForEdit });
		this.elModalDelete.show();
	}

	@bind
	async onClickEventEditorAdd__saveBtn(e: React.MouseEvent<HTMLButtonElement>) {
		e.preventDefault();

		if (!this.eventEditorAdd.elForm.isValid()) {
			return;
		}

		var result =
			await getPromiseFromAction(
				this.props.addRequest(this.eventEditorAdd.elForm.getData())
			);

		if (!result.hasErrors) {
			this.pagingBar.setLastPage();
			this.elModalAdd.hide();
		}
	}

	@bind
	async onClickEventEditorEdit__saveBtn(e: React.MouseEvent<HTMLButtonElement>) {
		if (!this.eventEditorEdit.elForm.isValid()) {
			return;
		}

		var data = this.eventEditorEdit.elForm.getData();

		var result = await getPromiseFromAction(
			this.props.updateRequest(data)
		);

		if (!result.hasErrors) {
			this.elModalEdit.hide();
		}
	}

	@bind
	onClickEventEditorDelete__saveBtn(e: React.MouseEvent<HTMLButtonElement>): void {
		this.props.deleteRequest(this.state.modelForEdit.id);
		this.elModalDelete.hide();
	}

	@bind
	renderRow(event: IEventModel) {
		return <tr key={event.id}>
			<td>{event.subject}</td>
			<td>{event.description}</td>
			<td>{event.eventStart}</td>
			<td>{event.eventDuration}</td>
			<td>{event.attendees.toString()}</td>
		</tr>;
	}

	@bind
	renderRows(data: IEventModel[]) {
		return data
			.slice(this.state.rowOffset, this.state.rowOffset + this.state.limitPerPage)
			.map(x => this.renderRow(x));
	}

	@bind
	onChangeSearchInput(e: React.ChangeEvent<HTMLInputElement>) {
		var val = e.currentTarget.value;
		this.debouncedSearch(val);
		this.pagingBar.setFirstPage();
	}

	render() {

		return <div>
			<Helmet>
				<title>Event Manager</title>
			</Helmet>

			<Loader show={this.props.indicators.operationLoading} />

			<div className="panel panel-default">
				<div className="panel-body row">
					<div className="col-sm-1">
						<button className="btn btn-success" onClick={this.onClickShowAddModal}>Add</button>
					</div>
					<div className="col-sm-11">
						<input
							type="text"
							className="form-control"
							defaultValue={""}
							onChange={this.onChangeSearchInput}
							placeholder={"Search for events ..."}
						/>
					</div>
				</div>
			</div>

			<table className="table">
				<thead>
					<tr>
						<th>Subject</th><th>Description</th><th>Event Start</th><th>Duration</th><th>Attendees</th>
					</tr>
				</thead>
				<tbody>
					{this.renderRows(this.props.events)}
				</tbody>
			</table>

			<ModalComponent
				ref={x => this.elModalAdd = x}
				buttons={<div>
					<button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
					<button type="button" className="btn btn-primary" onClick={this.onClickEventEditorAdd__saveBtn}>Save</button>
				</div>}
				title="Add event"
				onHide={() => {
					if (this.eventEditorAdd) {
						this.eventEditorAdd.emptyForm();
					}
				}}>
				<EventEditor ref={x => this.eventEditorAdd = x} data={{}} />
			</ModalComponent>

			<ModalComponent
				ref={x => this.elModalEdit = x}
				buttons={<div>
					<button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
					<button type="button" className="btn btn-primary" onClick={this.onClickEventEditorEdit__saveBtn}>Save</button>
				</div>}
				title={`Edit event: ${this.state.modelForEdit.subject}`}
				onHide={() => {
					if (this.eventEditorEdit) {
						this.eventEditorEdit.emptyForm();
					}
				}}>
				<EventEditor ref={x => this.eventEditorEdit = x} data={this.state.modelForEdit} />
			</ModalComponent>

			<ModalComponent
				ref={x => this.elModalDelete = x}
				buttons={<div>
					<button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
					<button type="button" className="btn btn-primary" onClick={this.onClickEventEditorDelete__saveBtn}>Delete</button>
				</div>}
				title={`Delete event: ${this.state.modelForEdit.subject}`}>
				<p>Do you really want to delete this event?</p>
			</ModalComponent>

			<PagingBar
				ref={x => this.pagingBar = x}
				totalResults={this.props.events.length}
				limitPerPage={this.state.limitPerPage}
				currentPage={this.state.pageNum}
				onChangePage={this.onChangePage}
			/>
		</div>;
	}
}

var component = connect(
	(state: ApplicationState) => state.event,
	EventStore.actionCreators
)(EventPage as any);

export default (withRouter(component as any) as any as typeof EventPage)