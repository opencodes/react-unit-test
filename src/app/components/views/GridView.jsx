import React, { useState } from 'react'

//Hooks Usecase
export const GridView = () => {
    const [firstName, setfirstName] = useState('Raj');

    const handleChange = (e) => {
        console.log(e);
    }

    return (
        <div className="card">
            <div className="card-header">
                Featured <div className='float-right'><input onChange={handleChange} value></input></div>
            </div>
            <div className="card-body">

            </div>
        </div>
    )
}