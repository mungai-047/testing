import {Component} from "react";
import Eit from "./Task";
import React from "react";
import {withTracker} from 'meteor/react-meteor-data';
import {Eits} from "../api/eits";



class Table extends Component {

    state = {
        eitToEdit: {},
        isEditting: false,
        firstName: '',
        surname: '',
        country: '',
        age: ''
    };



    eitToEdit(eit) {
        this.setState({
            eitToEdit: eit,
            firstName: eit.firstName,
            surname: eit.surname,
            country: eit.country,
            age: eit.age,
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

            <ul>
                <table cellSpacing={"0"}>{this.renderEits()
                }</table>
            </ul>
        )
    }
}


export default withTracker(() => {
    return {
        eits: Eits.find({}, { sort: { createdAt: -1 } }).fetch(),
    };
})(Table);