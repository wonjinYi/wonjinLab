import {useState, useEffect} from 'react';

import styled from 'styled-components';

import wannagohome from './img/wannagohome.png';
function Home() {


    return (
        <HomeWrap>
            <img src={wannagohome} alt="gohome" />
            <p style={{color:"grey"}}>goranimaster17@gmail.com</p>
        </HomeWrap>
    )
}

const HomeWrap = styled.div`
    display : flex;
    flex : 1;
    flex-direction : column;
    justify-content : center;
    align-items : center;
   
    padding : 24px;
`;

export default Home;