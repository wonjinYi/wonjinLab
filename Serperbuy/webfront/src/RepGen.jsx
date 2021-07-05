import {useState, useEffect} from 'react';
import Loading from './Loading';
import styled from 'styled-components';
import { Input, Button } from 'antd';
const { TextArea } = Input;



function RepGen() {
    const [isLoading, setIsLoading] = useState(false);

    const [labelSrc, setLabelSrc] = useState('');
    const [userSrc, setUserSrc] = useState('');
    const [report, setReport] = useState([])

    const onGazua = () => {
        setIsLoading(true);

        try {
            // 유저 정보 가공
            const parsedUsers = JSON.parse(userSrc);
            let users = [] 
            console.log(parsedUsers);
            parsedUsers.forEach( e => {
                users = [...users, ...e.users];
            });
            console.log(users);

            // 리포트 객체 만들기
            const labels = (JSON.parse(labelSrc)).results;
            const arr = [];
            labels.forEach( e => {
                let obj = {};
                obj.datakey = e.asset.key;
                obj.email = e.work_assignee;
                obj.issueCnt = e.open_issue_count;
            
                for(const user of users){
                    if(user.email === obj.email){
                        obj.name = user.name;
                        break;
                    }
                }

                arr.push(obj);
            })
            setReport([...arr]);
        } catch (err) {
            console.error(err);
        }
        
        setIsLoading(false);
    }

    useEffect( () => {
        console.log(report);
    }, [report]);

    return (
        <RepGenWrap>
            <p>RepGen :: Report Generator</p>

            <InputContainer>
                <p style={{color:"#FF625A", fontWeight:"bold", fontSize:"32px"}}>users/</p>
                <JsonInput placeholder="users/" value={userSrc} onChange={e=>setUserSrc(e.target.value)} rows={4} />
                
                <JsonInput placeholder="labels/" value={labelSrc} onChange={e=>setLabelSrc(e.target.value)}  rows={4} />
                <p style={{color:"#FF625A", fontWeight:"bold", fontSize:"32px"}}>labels/</p>
            </InputContainer>
            
            <ConvertBtn style={{margin:"24px"}} onClick={onGazua} size="large">가즈아</ConvertBtn>

            <TableContainer>
                <Table>
                    <TableRow style={{borderTop:"none", borderBottom:"1px solid #FF625A"}}>
                        <TableCell style={{color:"#FF625A", fontWeight:"bold"}}>어사이니</TableCell>
                        <TableCell style={{color:"#FF625A", fontWeight:"bold"}}>메일</TableCell>
                        <TableCell style={{color:"#FF625A", fontWeight:"bold"}}>데이터키</TableCell>
                        <TableCell style={{color:"#FF625A", fontWeight:"bold"}}>이슈카운트</TableCell>
                    </TableRow>
                    {
                        report.map( (item,index) => (
                            <TableRow key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.email}</TableCell>
                                <TableCell>{item.datakey}</TableCell>
                                <TableCell>{item.issueCnt}</TableCell>
                            </TableRow>
                        ))
                    }
                    
                </Table>
            </TableContainer>

            <Loading isLoading={isLoading} />
        </RepGenWrap>
    )
}

const RepGenWrap = styled.div`
    display : flex;
    flex : 1;
    flex-direction : column;
    align-items : center;

    padding : 24px 64px;
`;

const InputContainer = styled.div`
    display : flex;
    width : 100%;
`;

const JsonInput = styled(TextArea)`
    margin : 8px;
    &:hover { border-color : #FF625A; }
    &:focus { 
        border-color : #FF625A; 
        box-shadow: 0 0 0 5px #FF625A30;
    }
`;

const ConvertBtn = styled(Button)`
    width : 128px;
    height : 128px;
    border-radius : 64px;
    &:hover { 
        border-color : #FF625A; 
        color : #FF625A;
    }
    &:focus { 
        border-color : #FF625A; 
        color : #FF625A
    }
`;

const TableContainer = styled.div`
    border : 2px solid #D9D9D9;
    border-radius : 24px;
    padding : 8px;
`;

const Table = styled.table`
    text-align : center;
`;

const TableRow = styled.tr`
    border-top : 1px solid #D9D9D9;
`;

const TableCell = styled.td`
    padding : 16px 24px;
    
`;

export default RepGen;