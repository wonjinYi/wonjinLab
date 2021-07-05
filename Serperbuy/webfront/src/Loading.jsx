// imported Modules =============================================
import { React } from "react";

import styled from "styled-components";
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';

// Main Component ===============================================
export default function Loading ({ isLoading }) {
    
    if ( isLoading ){
        return (
            <LoadingWrap className="Loading">
                <Backdrop></Backdrop>
                <Spin spinning={isLoading} size="large" indicator={<LoadingOutlined style={{ fontSize: 64 }} spin />} />
            </LoadingWrap>
        );
    } else {
        return <div className="Loading"></div>;
    }
   
}

// style ========================================================
const LoadingWrap = styled.div`
    position : fixed;
    top : 0; 
    left : 0;
    display : flex;
    justify-content : center;
    align-items : center;
    width : 100%; 
    height : 100%;
    `;

const Backdrop = styled.div`
    position : fixed;
    top : 0; 
    left : 0;
    width : 100%;
    height : 100%;
    background-color : rgba(0,0,0, 0.75);
    `;