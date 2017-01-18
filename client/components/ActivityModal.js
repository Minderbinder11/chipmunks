// ActivityModal.js
import React                   from 'react';
import axios                   from 'axios';
import { observer }            from 'mobx-react';

import ActivityBox              from './ActivityBox';
import Store                    from './Store';
import TextField                from 'material-ui/TextField';
import DayPicker, { DateUtils } from 'react-day-picker';
import MuiThemeProvider         from 'material-ui/styles/MuiThemeProvider';
import Snackbar                 from 'material-ui/Snackbar';
import moment from 'moment';

import 'react-day-picker/lib/style.css';

// these come out of the database
var typeArray     = ['connections', 'follow up', 'phone', 'meetup', 'sentEmail', 'receivedEmail', 'apply',
                      'phoneInterview', 'webInterview', 'personalInterview'];
// var diaplay names
var diaplayNames = ['Connection', 'Follow Up', 'Phone Call', 'Meet Up', 'Sent Email', 'Received Email', 'Apply',
                      'Phone Interview', 'Web Interview', 'Personal Interview'];
// display names on the activity modal
var activityArray = ['Reach Out', 'Call', 'Meet Up', 'E-Mail', 'Apply', 'Interview'];
// maps to icons on the activity modal
var iconNameArray = ['build', 'phone', 'loop', 'email', 'send',  'stars'];


@observer class ActivityModal extends React.Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.saveDate = this.saveDate.bind(this);
    this.state = {
      snack: false,
      errorMessage: '',
      selectedDay: new Date(),
      displayName: '',
      completed: false
    };
    this.isDaySelected = this.isDaySelected.bind(this);

  }

  componentWillMount() {

    if (this.props.action !== undefined) {

      if (this.props.action.completedTime !== null) {
        this.setState({completed:true});
      }

      Store.addActivity.scheduledTime = this.props.action.scheduledTime;
      var tempDate = moment(Store.addActivity.scheduledTime).toDate();
      // console.log('tempdate', tempDate);
      this.setState({selectedDay: tempDate});
      Store.addActivity.description = this.props.action.description;
      Store.addActivity.company = this.props.action.company;
      Store.addActivity.notes = this.props.action.notes;
      Store.addActivity.type = this.props.action.type;

      // console.log('modal action type ', this.props.action.type);
      if (this.props.action.type === 'connections') {
        Store.selectedActivityBox = 0;
        this.setState({displayName: 'Connection'});

      } else if (this.props.action.type === 'follow up') {

        this.setState({displayName: 'Follow Up'});
        Store.selectedActivityBox = 0;

      } else if (this.props.action.type === 'phone') {

        this.setState({displayName: 'Phone Call'});
        Store.selectedActivityBox = 1;

      } else if (this.props.action.type === 'meetup') {

        this.setState({displayName: 'Meet Up'});
        Store.selectedActivityBox = 2;
      } else if (this.props.action.type === 'sentEmail') {

        this.setState({displayName: 'Sent Email'});
        Store.selectedActivityBox = 3;
      } else if (this.props.action.type === 'receivedEmail') {

        this.setState({displayName: 'Received Email'});
        Store.selectedActivityBox = 3;

      } else if (this.props.action.type === 'apply') {

        this.setState({displayName: 'Apply'});
        Store.selectedActivityBox = 4;

      } else if (this.props.action.type === 'phoneInterview' ) {

        this.setState({displayName: 'Phone Interview'});
        Store.selectedActivityBox = 5;

      } else if (this.props.action.type === 'webInterview' ) {
        this.setState({displayName: 'Web Interview'});
        Store.selectedActivityBox = 5;

      } else if (this.props.action.type === 'personalInterview') {

        this.setState({displayName: 'On Site Interview'});
        Store.selectedActivityBox = 5;

      } else if (this.props.action.type === 'learn') {
        this.setState({displayName: 'Learn'});

      } else if (this.props.action.type === 'offer') {
        this.setState({displayName: 'Offer'});
      }
    }
  }

  saveDate (e, date) {
    e.preventDefault();
    if (!this.state.completed) {
      var formattedDate = moment(date).toISOString();

      this.setState({selectedDay: date});
      // time zone questions
      Store.addActivity.scheduledTime = formattedDate;
    }
  }

  isDaySelected(day) {
    return DateUtils.isSameDay(day, this.state.selectedDay);
  }

  handleClick (e) {

    e.preventDefault();

    // make sure its editable
    if (!this.state.completed) {
      // do some error checking to make sure an action has been selected  also check for a description
      if (Store.selectedActivityBox !== -1 &&
          Store.addActivity.scheduledTime !== '' &&
          Store.addActivity.description !== '') {

        var type = Store.addActivity.type;
        Store.addActivity.company = this.props.job.company;
        Store.addActivity.actionSource = 'user';


        if (this.props.id === -1) {

          var obj = {
            userId:         Store.currentUserId,
            jobId:          this.props.job.id,
            type:           type,
            description:    Store.addActivity.description,
            notes:          Store.addActivity.notes,
            company:        this.props.job.company,
            actionSource:   'user',
            scheduledTime:  Store.addActivity.scheduledTime,
            completedTime:  null
          };

          // console.log('posting to axios');
          axios.post(`/actions`, obj)
          .then(function(response) {
            Store.jobActions.push(response.data);
          })
          .catch(function(error) {
            console.log(error);
          });

        } else {

          var putObj = {
            type:           type,
            description:    Store.addActivity.description,
            scheduledTime:  Store.addActivity.scheduledTime,
            notes:          Store.addActivity.notes,
          };

          var that = this;
          // console.log('putting to axios');
          axios.put(`/actions/${this.props.action.id}`, putObj)
          .then((response) => {

            axios.get(`/actions/${Store.currentUserId}/${this.props.job.id}`)
              .then(function(response) {
                Store.jobActions = response.data;
              })
              .catch(function(error) {
                console.log(error);
              });
          })
          .catch(function(error) {
            console.log(error);
          });
        } // end if/else for Post / Put

        Store.selectedActivityBox = -1;
        Store.addActivity.description = '';
        Store.addActivity.scheduledTime = '';
        Store.addActivity.notes = '';


      } else {
        // will have to message that no task type selected.
        var errorMessage = 'Please include a task, date and description';
        this.setState({
          errorMessage: errorMessage,
          snack: true
        });
      }
    }

    this.props.onClick();
  }


  change(e) {
    Store.addActivity[e.target.name] = e.target.value;
  }


  render () {

    var closeCommand = 'Save';

    if (this.state.completed) {
      closeCommand = 'Close';
    }

    return (
      <div>
        <div className="modalSelectors">
          <div className="activityModalType">
            <div className="activityTypeHeader">
              <p>Activity Type: <span className="medium">{this.state.displayName} </span></p>
            </div>
            <div className="activityModalIcons">
              {activityArray.map((activity, index) => {
                return (<ActivityBox type={activity} icon={iconNameArray[index]} key={index}
                                      id={index} disabled={this.state.completed}/>);
              })}
            </div>
          </div>
          <div>
            <DayPicker onDayClick={ this.saveDate } selectedDays={ this.isDaySelected } />
          </div>
        </div>
        <form>
          <div className="row">
            <div className="input-field col s12">
              <MuiThemeProvider >
                <TextField floatingLabelText="Description" multiLine={true} fullWidth={true} disabled={this.state.completed}
                           name="description" onChange={this.change} value={Store.addActivity.description}/>
              </MuiThemeProvider>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <MuiThemeProvider >
                <TextField floatingLabelText="Notes" multiLine={true} fullWidth={true} disabled={this.state.completed}
                          rows={3} rowsMax={6} name="notes" onChange={this.change} value={Store.addActivity.notes}/>
              </MuiThemeProvider>
            </div>
          </div>
        </form>
        <div className="activityClose" onClick={this.handleClick.bind(this)}>{closeCommand}</div>
        <MuiThemeProvider>
          <Snackbar open={this.state.snack}  message={`${this.state.errorMessage}`} autoHideDuration={2000}
                    onRequestClose={this.handleRequestClose}/>
        </MuiThemeProvider>

      </div>
    );
  }

}

export default ActivityModal;