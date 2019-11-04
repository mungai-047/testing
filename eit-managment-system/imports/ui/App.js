import React, { Component } from 'react';
import {withTracker} from 'meteor/react-meteor-data';
import {Eits} from '../api/eits.js';
import {Meteor} from "meteor/meteor"
import Table from './Table.js';
import AccountsUIWrapper from "./AccountsUIWrapper";
import Eit from "./Task";

 class App extends Component {

     state = {
         eitToEdit: {},
         isEditting: false,
         firstName: '',
         surname: '',
         country: '',
         age: '',
         createdBy: ''
     };



     handleSubmit(event) {
         event.preventDefault();

         const { firstName, surname, country, age, createdBy} = this.state;


         if(this.state.isEditting) {

             if (this.props.currentUser.emails[0].address === this.state.createdBy ){


                 Eits.update(this.state.eitToEdit._id, {
                     $set: {
                         firstName: firstName,
                         surname: surname,
                         country: country,
                         age: age
                     }
                 });

                 this.setState({
                     eitToEdit: {},
                     firstName: '',
                     surname: '',
                     country: '',
                     age: '',
                     isEditting: false
                 })

             }else {

                 alert("You do not have permission!")
             }

         } else {




             Eits.insert({
                 firstName,
                 surname,
                 country,
                 age,
                 createdBy: this.props.currentUser.emails[0].address ,
                 createdAt: new Date(),


             });
             this.setState({
                 eitToEdit: {},
                 firstName: '',
                 surname: '',
                 country: '',
                 age: '',


             });
         }
     }

     eitToEdit(eit) {
         this.setState({
             eitToEdit: eit,
             firstName: eit.firstName,
             surname: eit.surname,
             country: eit.country,
             age: eit.age,
             createdBy: eit.createdBy,
             isEditting: true
         });
     }

     renderEits() {
         return this.props.eits.map((eit, index) => (
             <Eit key={index} index={index+1} eit={eit} eitToEdit={this.eitToEdit.bind(this)} />

         ));
     }


     render() {
    return (
        <div className="row">


            <header>

                <h1> EITs Management System</h1>

                <h3>Sign in Below</h3>

                <AccountsUIWrapper/>

                <br></br><br></br>



            </header>


          <br></br>



         <br></br>


            {
                (this.props.currentUser) ?(

                <form  onSubmit={this.handleSubmit.bind(this)} >
                <label htmlFor="firstname">First Name :</label>{' '}
                <input
                type="text"
                ref="firstName"
                placeholder="First Name"
                value={this.state.firstName}
                required
                onChange={e => this.setState({ firstName: e.target.value })}
                />{' '}
                <label htmlFor="surname">Surname :</label>{' '}
                <input
                type="text"
                ref="surname"
                placeholder="Surname"
                value={this.state.surname}
                required
                onChange={e => this.setState({ surname: e.target.value })}
                />{' '}
                <label htmlFor="Country">Country :</label>{' '}
                <input
                type="text"
                ref="country"
                placeholder="Country"
                value={this.state.country}
                required
                onChange={e => this.setState({ country: e.target.value })}
                />{' '}
                <label htmlFor="Age"> Age :</label>{' '}
                <input
                type="text"
                ref="age"
                placeholder="Age"
                value={this.state.age}
                required
                onChange={e => this.setState({ age: e.target.value })}
                />{' '}
                <button type="submit">{this.state.isEditting ? 'Update Record' : 'Add Record'}</button>

                </form>
                ) : ("")
            }


<br></br>
         <br></br>

            <ul>
                <table cellSpacing={"0"}>{this.renderEits()
                }</table>
            </ul>

            <br></br><br></br>

            {
                (this.props.currentUser)?(
                    <button onClick={e => {
                        const eits = Eits.find({ checked: true });
                        eits.forEach(eit => {
                            Eits.remove(eit._id);
                        })
                    }}>Delete Selected</button>

                ) : ("")
            }

      </div>

    );

  }


}

export default withTracker(() => {
  return {
    eits: Eits.find({}, { sort: { createdAt: -1 } }).fetch(),currentUser:Meteor.user(),
  };
})(App);