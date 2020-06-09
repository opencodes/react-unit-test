import React, { useState } from 'react'
//Hooks Usecase
export const TileView = (props) => {
    const { users } = props;
    // const [firstName, setFirstName] = useState('Raj');
    const [query, setquery] = useState()
    const [counter, setcounter] = useState(0)
    const handleChange = (e) => {
        setquery(e.target.value);
    }
    const incrementCounter = (e) => {
        setcounter(counter + 1);
    }
    return (
        <div className="card">
            <p data-testid='counter' id='counter'>{counter}</p>
            <p data-testid='textField' id='textField'>{query}</p>
            <div className="card-header">
                Featured <div className='float-right'>
                    <input onChange={handleChange} value={query}></input>
                    <button onClick={incrementCounter}>Increment</button>
                </div>
            </div>
            <div className="card-body">
                <div className="row">
                    {
                        users.map(user => (
                            <div className="col-3" key={user.name}>
                                <div className="card">
                                        <h4>{user.name}</h4>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}