import React, { Component, useState, useEffect } from 'react'
import Axios from 'axios';
import appServices from '../services/app.services';
import { TileView } from './views/TileView';
import { GridView } from './views/GridView';

const DashboardContainer = () => {
    const [users, setusers] = useState([]);
    const [count, setcount] = useState(0);
    const [loaded, setloaded] = useState(false)
    const [view, setview] = useState('tile')

    useEffect(() => {
        loadUsers();
    }, [])


    const loadUsers = async () => {
        setloaded(false);
        setusers([]);
        setcount(0);


        try {
            const users = await appServices.getUsers();
            setloaded(true);
            setusers(users);
            setcount(users.length);
        } catch (error) {
            setloaded(false);
        }
    }




    return (
        <div class="container-fluid">

            {
                loaded == true ? <div>
                    {
                        view === 'tile' ? <TileView users={users} /> : <GridView users={users} />
                    }
                </div> : 'Loadin ..'
            }
        </div>
    )
}

export default DashboardContainer;
