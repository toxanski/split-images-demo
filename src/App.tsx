import React from 'react';
import forest from './forest.jpg'
import winter from './winter.jpg';
import Split from "./Components/Split/Split";

function App() {
    return (
        <>
            <Split left={forest} right={winter}/>
        </>
    );
}

export default App;
