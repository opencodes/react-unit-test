import React, { Component } from 'react'
import Axios from 'axios';
import appServices from '../services/app.services';

export default class DashboardContainer extends Component {
    state = {
        users: [],
        count: 0,
        loaded: false
    }
    componentDidMount() {
        this.loadUsers();
    }

    loadUsers = async () => {
        this.setState({
            loaded: false,
            users: [],
            count: 0
        });

        try {
            const users = await appServices.getUsers();
            this.setState({
                users: users,
                count: users.length,
                loaded: true
            });
        } catch (error) {
            this.setState({
                loaded: false
            });
        }
    }



    render() {
        const { loaded, users } = this.state;
        return (
            <div>
                {
                    loaded == true ? <div>
                        {
                            users.map(u => <h1  key={u.id}>{u.name}</h1>)
                        }
                    </div> : null
                }
            </div>
        )
    }
}
