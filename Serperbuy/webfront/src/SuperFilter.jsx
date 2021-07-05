import {useState, useEffect} from 'react';

import styled from 'styled-components';
import { Button } from 'antd';

import Tag from "./Tag";

function SuperFilter() {
    const [allof, setAllof] = useState(["aa", "bb"]);
    const [noneof, setNoneof] = useState([]);

    return (
        <SuperFilterWrap>
            <h3>SuperFilter Route</h3>
            <p>집에가고싶다</p>
            {/*<Filter>
                <FilterName>모두 포함</FilterName>
                { allof.map( (tag, index) => <Tag name={tag} index={index} state={allof} setState={setAllof}/> ) }
                
            </Filter> */}
            
            

        </SuperFilterWrap>
    )
}

const SuperFilterWrap = styled.div`
    display : flex;
    flex-direction : column;
    align-items : center;

    padding : 24px;
`;

const Filter = styled.div`
    display : flex;
    align-items : center;
    padding : 16px;
`;

const FilterName = styled.h3`
    color : #FF625A;
    font-weight : 800;
    font-size : 16px;
    margin : 0;
`;

export default SuperFilter;