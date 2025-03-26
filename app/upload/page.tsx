'use client' // is needed only if you’re using React Server Components
import { FileUploaderInline } from '@uploadcare/react-uploader/next';
import '@uploadcare/react-uploader/core.css';
import { useEffect } from 'react';

export default function Upload() {

    let galleryBtn: HTMLButtonElement;
    let cameraBtn: HTMLButtonElement;
    useEffect(() => {
        setTimeout(() => {
            const wrapper = document.querySelector('#upload-wrapper')?.children[0] as HTMLElement;
            const buttons = wrapper.querySelectorAll('uc-source-btn')
            
            galleryBtn = buttons[0] as HTMLButtonElement
            cameraBtn = buttons[1] as HTMLButtonElement
        }, 500);
    }, []);

    const openGallery = () => {
        galleryBtn.click()
    }

    const openCamera = () => {
        cameraBtn.click()
    }

    return (
        <div className='flex flex-col items-center justify-between w-full h-screen'>
            <div className='h-1/5 bg-[#323233] w-full text-white flex flex-col items-center py-4 justify-between'>
                <h1 className='text-5xl font-bold'>VIDEO WALL</h1>
                <p className='text-center text-[#C5ACAD] text-2xl font-bold'>Selecciona la <br /> opción deseada</p>
            </div>
            <div className='w-full sm:w-2/3 md:w-1/3 p-2 rounded-md px-6' id="upload-wrapper">
                <div className='space-y-6'>
                    <div className='relative' onClick={openGallery}>
                        <p className='text-center text-white text-3xl font-bold absolute top-1/2 transform -translate-y-1/2 left-8'>GALERIA</p>
                        <img src="/galleryBtn.svg" alt="Logo Xignux" />
                    </div>
                    <div className='relative' onClick={openCamera}>
                        <p className='text-center text-white text-3xl font-bold absolute top-1/2 transform -translate-y-1/2 left-8'>CÁMARA</p>
                        <img src="/cameraBtn.svg" alt="Logo Xignux" />
                    </div>
                    <FileUploaderInline
                        imgOnly={true}
                        sourceList="local, camera"
                        multiple={false}
                        confirmUpload={true}
                        classNameUploader="uc-light"
                        pubkey="ada58ca1bcd6b5d856ef"
                        className="[&_uc-drop-area]:hidden [&_.uc-add-more-btn]:hidden [&_uc-source-btn>button]:opacity-0 [&_uc-source-btn>button]:h-0 [&_uc-icon]:h-0 [&_.uc-txt]:h-0 [&_uc-source-list]:h-0 [&_.uc-content]:p-0 [&_.uc-thumb]:h-36 [&_.uc-thumb]:w-36 [&_.uc-file-name-wrapper]:hidden [&_.uc-inner]:flex [&_.uc-inner]:flex-col [&_.uc-inner]:justify-center"
                    />
                </div>
            </div>
            <div className='h-1/5 p-8'>
                <img src="/logoxignux.svg" alt="Logo Xignux" className='h-full' />
            </div>
        </div>
    );
}