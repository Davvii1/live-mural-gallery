'use client' // is needed only if you’re using React Server Components
import { FileUploaderInline } from '@uploadcare/react-uploader/next';
import '@uploadcare/react-uploader/core.css';

export default function Upload() {
    return (
        <div className='flex justify-center items-center w-full h-screen border border-blue-500 px-4'>
            <div className='w-full sm:w-2/3 md:w-1/3 border border-black p-2 rounded-md'>
                <FileUploaderInline
                    imgOnly={true}
                    sourceList="local, camera"
                    classNameUploader="uc-light"
                    pubkey="ada58ca1bcd6b5d856ef"
                />
            </div>
        </div>
    );
}