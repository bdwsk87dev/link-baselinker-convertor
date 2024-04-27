import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { InertiaLink, Head } from '@inertiajs/inertia-react';
import Menu from '../menu/menu.jsx';



const Home = () => {

    // Type of the file xml or csv
    const [fileType , setFileType] = useState('xml');

// File itself
    const [file, setFile] = useState(null);

// Uploading type
    const [uploadType, setUploadType] = useState('file');

    return (
        <div>
            <style>
                {`
                    body{
                        height: 100%;
                        background: #bbbbbb;
                    }

                    .block
                    {
                        background-color:#ffffff;
                        padding:15px;
                        border-radius:5px;
                        margin-bottom:3px;
                        border-top-left-radius: 0px;
                        border-top-right-radius: 0px;
                    }
                `}
            </style>

            <Menu/>

            <div className='block'>

                <form className="upload-form" encType="multipart/form-data" onSubmit={handleSubmit}>

                    <span>Як завантажувати файл</span>

                    <select
                        value={uploadType}
                        onChange={(e) => setUploadType(e.target.value)}
                    >
                        <option value="file">Upload file and convert</option>
                        <option value="link">Convert from link</option>
                    </select>

                </form>


            </div>


        </div>
    );
};

export default Home;
