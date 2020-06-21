import React from 'react';
import {Route, BrowserRouter} from 'react-router-dom'; // mudandça de página

import Home from './pages/Home';
import CreatePoint from './pages/CreatePoint';

const Routes = () =>{
    
    return(
       <BrowserRouter> {/* local onde fica páginas em rotas */}
       
            <Route component={Home} path="/" exact/> 
            <Route component={CreatePoint} path="/create-point" />]
     

       </BrowserRouter> 
    )
}

export default Routes;