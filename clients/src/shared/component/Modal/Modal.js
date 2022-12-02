import React from 'react';
import { CSSTransition } from 'react-transition-group';
import Backdrop from './Backdrop';
import './Modal.scss';

const Modal = ({
    className,
    style,
    headerClass,
    header,
    onSubmit,
    contentClass,
    footerClass,
    footer,
    children,
    show,
    onCancel
}) => {

    return (
        <React.Fragment>
            {show && <Backdrop onClick={onCancel} />}
            <CSSTransition
                in={show}
                timeout={300}
                classNames='modal'
                mountOnEnter
                unmountOnExit
            >
                <div className={`modal d-block ${className}`} style={{ style }}>
                    <header className={`modal__header ${headerClass}`}>
                        <h2>{header}</h2>
                    </header>
                    <form onSubmit={onSubmit ? onSubmit : (e) => e.preventDefault()}>
                        <div className={`modal__content ${contentClass}`}>
                            {children}
                        </div>
                    </form>
                    <footer className={`modal__footer ${footerClass}`}>
                        {footer}
                    </footer>
                </div>
            </CSSTransition>
        </React.Fragment>
    );
}


export default Modal;