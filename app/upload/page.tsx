'use client' // is needed only if you’re using React Server Components
import { FileUploaderInline } from '@uploadcare/react-uploader/next';
import '@uploadcare/react-uploader/core.css';
import { useEffect, useState } from 'react';
import { Confirm } from '@/components/svg/confirm';
import { Spinner } from '@/components/svg/spinner';
import { useRouter } from 'next/navigation';

export default function Upload() {
    const [isFileSelected, setIsFileSelected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const [isRendering, setIsRendering] = useState(true);

    const [galleryBtn, setGalleryBtn] = useState<HTMLButtonElement>()
    const [cameraBtn, setCameraBtn] = useState<HTMLButtonElement>()

    const router = useRouter()

    useEffect(() => {
        setTimeout(() => {
            const wrapper = document.querySelector('#upload-wrapper')?.children[0] as HTMLElement;
            const buttons = wrapper.querySelectorAll('uc-source-btn')
            const ctx = document.querySelector('uc-upload-ctx-provider')

            ctx?.addEventListener('file-upload-success', e => {
                setIsLoading(false)
                setIsFileUploaded(true)
            })

            ctx?.addEventListener('upload-click', e => {
                setIsLoading(true)
            })

            ctx?.addEventListener('file-added', e => {
                setIsFileSelected(true)
            })

            ctx?.addEventListener('activity-change', (e: any) => {
                if (e.detail.activity === "start-from") {
                    setIsFileSelected(false)
                }
            })

            setGalleryBtn(buttons[0] as HTMLButtonElement)
            setCameraBtn(buttons[1] as HTMLButtonElement)

            setIsRendering(false)
        }, 500);
    }, [isFileSelected]);

    const openGallery = () => {
        if (!galleryBtn) return
        galleryBtn.click()
    }

    const openCamera = () => {
        if (!cameraBtn) return
        cameraBtn.click()
    }

    const handleContinue = () => {
        window.location.reload()
    }

    return (
        <div className='flex flex-col items-center justify-between w-full h-dvh overflow-hidden'>
            <div className='h-1/5 bg-[#323233] w-full text-white flex flex-col items-center py-4 justify-between'>
                <h1 className='[@media(max-height:850px)]:text-4xl text-5xl font-bold text-center'>MURAL<br />22ª. RADX</h1>
                <p className='text-center text-[#C5ACAD] text-2xl font-bold [@media(max-height:800px)]:text-xl [@media(max-height:750px)]:hidden'>Selecciona la <br /> opción deseada</p>
            </div>
            <div className='w-full sm:w-2/3 md:w-1/3 py-2 px-6 max-h-[60%] overflow-y-auto' id="upload-wrapper">
                <div className='space-y-6'>
                    {!isFileSelected && !isFileUploaded && (
                        <>
                            <div className={`${isRendering ? 'opacity-50' : ''} relative`} onClick={openGallery}>
                                <p className='text-center text-white text-3xl font-bold absolute top-1/2 transform -translate-y-1/2 left-8'>GALERIA</p>
                                <img src="/galleryBtn.svg" alt="Subir desde galería" />
                            </div>
                            <div className={`${isRendering ? 'opacity-50' : ''} relative`} onClick={openCamera}>
                                <p className='text-center text-white text-3xl font-bold absolute top-1/2 transform -translate-y-1/2 left-8'>CÁMARA</p>
                                <img src="/cameraBtn.svg" alt="SUbir desde cámara" />
                            </div>
                        </>
                    )}
                    {isFileSelected && !isFileUploaded && !isLoading && (
                        <div className='text-2xl bg-[#CDCCCD] p-4 rounded-md flex items-center justify-center'>
                            <p className='text-[#343535] font-bold text-center'>¿Quieres agregar esta foto?</p>
                        </div>
                    )}
                    {isFileUploaded && (
                        <>
                            <div className='space-y-4 text-2xl bg-[#CDCCCD] p-4 rounded-md flex flex-col items-center justify-center'>
                                <Confirm />
                                <p className='text-[#343535] font-bold text-center'>
                                    ¿Quieres agregar otra imagen?
                                </p>
                            </div>
                            <div className='relative' onClick={handleContinue}>
                                <p className='text-center text-white text-3xl font-bold absolute top-1/2 transform -translate-y-1/2 left-8'>CONTINUAR</p>
                                <img src="/send.svg" alt="Continuar" />
                            </div>
                        </>
                    )}
                    <FileUploaderInline
                        imgOnly={true}
                        sourceList="local, camera"
                        multiple={false}
                        confirmUpload={true}
                        classNameUploader="uc-light"
                        pubkey="a0d86b82269d9922c222"
                        className={`${isFileUploaded ? 'h-0 opacity-0' : ''} [&_uc-drop-area]:hidden [&_.uc-add-more-btn]:hidden [&_uc-source-btn>button]:opacity-0 [&_uc-source-btn>button]:h-0 [&_uc-icon]:h-0 [&_.uc-txt]:h-0 [&_uc-source-list]:h-0 [&_.uc-content]:p-0 [&_.uc-thumb]:h-36 [&_.uc-thumb]:w-36 [&_.uc-file-name-wrapper]:hidden [&_.uc-inner]:flex [&_.uc-inner]:flex-col [&_.uc-inner]:justify-center`}
                    />
                </div>
            </div>
            <div className='h-1/5 p-8'>
                <img src="/logoxignux.svg" alt="Logo Xignux" className='h-full' />
            </div>
        </div>
    );
}
