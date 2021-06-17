import React from 'react';
import { withRouter } from 'react-router-dom';
import { Card} from 'react-bootstrap';


function AddHomeWork() {
  

    return (
        <>

            <div className="mt-5">
                <Card>
                    <Card.Header>
                        <h5 className="mt-2 mb-2 justifu-content-center">FIle Demo</h5>
                    </Card.Header>
                </Card>
                <Card.Body>
                <h5>Code Pipeline Demo</h5>
              </Card.Body>
            </div>


        </>
    )
}

export default withRouter(AddHomeWork);