import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import AccountsUIWrapper from '../imports/ui/AccountsUIWrapper.js';
import App from '../imports/ui/App.js';
import Table from '../imports/ui/Table.js';


export default function Flow() {
    return (
        <Router>
            <div>

                {/*<header>*/}

                    {/*<h1> EITs Management System</h1>*/}

                {/*<h3>Sign in Below</h3>*/}

                    {/*<AccountsUIWrapper/>*/}

                    {/*<br></br><br></br>*/}


                    {/*<Link to='/table'>See Eits</Link>*/}


                {/*</header>*/}

                <Switch>
                    <Route exact path="/app" component={App} />
                    <Route exact path="/table" component={Table} />

                </Switch>
            </div>
        </Router>
    );
}