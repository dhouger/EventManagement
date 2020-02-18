import { IEventModel } from "@Models/IEventModel";
import * as React from "react";
import bind from "bind-decorator";
import { Form } from "@Components/shared/Form";
import { Formik } from "formik";
import PersonEditor from "@Components/person/PersonEditor";

export interface IProps {
	data: IEventModel;
}

export default class EventEditor extends React.Component<IProps, {}> {

	private attendeesEditor: PersonEditor;

	constructor(props) {
		super(props);
	}

	public elForm: Form;

	@bind
	public emptyForm(): void {
		if (this.elForm) {
			this.elForm.emptyForm();
		}
	}



	componentDidMount() {
	}

	render() {

		return <Formik
			enableReinitialize={true}
			initialValues={{
				eventStart: this.props.data.eventStart || '',
				eventDuration: this.props.data.eventDuration || '',
				subject: this.props.data.subject || '',
				description: this.props.data.description || '',
				attendees: this.props.data.attendees || ''
			}}
			onSubmit={(values, { setSubmitting }) => {
			}}
		>
			{({
				values,
				errors,
				touched,
				handleChange,
				handleBlur,
				handleSubmit,
				isSubmitting,
			}) => (
					<Form className="form" ref={x => this.elForm = x}>
						<input type="hidden" name="id" defaultValue={(this.props.data.id || 0).toString()} />
						<div className="form-group">
							<label className="control-label required" htmlFor="event__eventStart">Event Start</label>
							<input
								type="string"
								className="form-control"
								id="event__eventStart"
								name={nameof<IEventModel>(x => x.eventStart)}
								data-value-type="string"
								data-val-required="true"
								data-msg-required="An event start date/time is required."
								value={values.eventStart.toString()}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
						</div>
						<div>
							<label className="control-label required" htmlFor="event__eventStart">Event Duration</label>
							<input
								type="string"
								className="form-control"
								id="event__eventDuration"
								name={nameof<IEventModel>(x => x.eventDuration)}
								data-value-type="string"
								data-val-required="true"
								data-msg-required="An event start duration is required."
								value={values.eventDuration}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
						</div>
						<div>
							<label className="control-label" htmlFor="event__eventStart">Subject</label>
							<input
								type="string"
								className="form-control"
								id="event__eventSubject"
								name={nameof<IEventModel>(x => x.subject)}
								data-value-type="string"
								data-val-required="false"
								value={values.subject}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
						</div>
						<div>
							<label className="control-label" htmlFor="event__eventStart">Description</label>
							<input
								type="string"
								className="form-control"
								id="event__eventDescription"
								name={nameof<IEventModel>(x => x.description)}
								data-value-type="string"
								data-val-required="false"
								value={values.description}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
						</div>
						<div>
							<label className="control-label required" htmlFor="event__eventStart">Attendees</label>
							<input
								type="element"
								className="form-control"
								id="event__eventAttendees"
								name={nameof<IEventModel>(x => x.attendees)}
								data-value-type="string"
								data-val-required="true"
								data-msg-required="An event start duration is required."
								value={values.attendees.toString()}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
						</div>
					</Form>)}
		</Formik>;
	}
}