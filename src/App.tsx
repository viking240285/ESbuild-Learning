import React, { useState } from 'react';
import './index.css'
import './second.css'
// @ts-ignore
import Logo from './Aku.png';

const App = () => {
    const [state, setState] = useState<number>(0);

    const onBtnClick = () => {
        // throw new Error();
        setState(state + 1)
    }

    return (
        <div>
            {/* <img src={Logo}  alt="Aku smile" /> */}
            Aku... Evil...
            <h1>value = ${state}</h1>
            {/* <button onClick={() => setState(state + 1)}>CLICK ME</button> */}
            <button onClick={onBtnClick}>CLICK ME</button>
        </div>
    );
};

export default App;