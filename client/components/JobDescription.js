//jobDescription.jsx
import React from 'react';
import { observer } from 'mobx-react';

@observer class JobDescription extends React.Component {

  constructor(props) {

    super(props);
  
  }

  render() {

    var today = new Date();
    var dateAdded = this.props.job.updatedAt;

    var days = Math.abs(today - dateAdded);

    var oneDay = 1000 * 60 * 60 * 24;
    days = Math.floor(days / oneDay);

    var classObject = '';

    if (days < 5) {
      classObject = 'new badge red';
    } else {
      classObject = 'new badge red hide';
    }

    const hasUrl = this.props.job.url;

    console.log('JD url: ', this.props.job.url);
    return (
      <div className="rateCompanyInfoBox left">
        <h3 className="rateCompanyJob">{this.props.job.jobTitle}
          <span className={`${classObject}`}></span>
        </h3>
        { this.props.rateView && <div><p className="rateCompanyName">{this.props.job.company + "    " + this.props.job.city}, {this.props.job.state}</p> </div> }
        <p className="rateCompanyText">{this.props.job.snippet}
          { hasUrl !== '' &&
          <a href={this.props.job.url} target="_blank" style={{marginLeft: '5px'}}>explore</a>
          }
        </p>
      </div>
    );
  }
}

export default JobDescription;