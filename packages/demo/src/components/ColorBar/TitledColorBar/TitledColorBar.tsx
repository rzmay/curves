import React from 'react';
import './TitledColorBar.scss';
import ColorBar from '../ColorBar';

function TitledColorBar(props: any): React.ReactElement {
    return (
        <div className="hsv-colorbar-container row">
            <div className="colorbar-title col-auto">
                <strong>{props.title ?? "Title"}</strong>
            </div>
            <div className="col">
                <ColorBar colors={props.colors ?? []} />
            </div>
        </div>
    )
}

export default TitledColorBar;