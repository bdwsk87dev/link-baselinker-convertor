import React from 'react';
import { InertiaLink } from '@inertiajs/inertia-react';

const Welcome = () => {
    return (
        <div>
            <h1>CONVERTED ZILLA</h1>
            <p>Please login to access the service.</p>
            <InertiaLink href="/login">Login</InertiaLink>
        </div>
    );
};

export default Welcome;
