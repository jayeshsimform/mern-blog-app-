import React from 'react';
import EmptyImage from '../../../images/empty-state.png'
import './EmptyState.scss'
const EmptyState = () => {
    return (
        <div className="empty-state">
            <div className="empty-state__content">
                <div className="empty-state__icon">
                    <img src={EmptyImage} alt="no data found" />
                </div>
                <div className="empty-state__message">No records has been added yet.</div>
                <div className="empty-state__help">
                    Add a new record by simpley clicking the button on top right side.
                </div>
                <a href="https://www.geeksforgeeks.org/how-to-open-url-in-new-tab-using-javascript/"

                    onClick={(e) => {
                        e.preventDefault()
                        window.open('pages.html');
                        window.focus()
                    }}
                >test</a>

            </div>
        </div>
    );
}

export default EmptyState;