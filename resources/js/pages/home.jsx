// Home.jsx
import React from 'react';
import Menu from '../menu/menu';

const Home = () => {
    return (
        <div>

            <style>
                {`
                    body{
                        height: 100%;
                        background: #bbbbbb;
                    }
                `}
            </style>

            <Menu/>
            <h1>Home Page</h1>
        </div>
    );
};

export default Home;
