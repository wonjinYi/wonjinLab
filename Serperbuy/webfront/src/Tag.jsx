import { Input } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons"
import 'antd/dist/antd.css';
function Tag({name, index, state, setState}) {

    const handleChange = (e) => {
        setState([...state.slice(0,index), e.target.value, ...state.slice(index+1, state.length)])
    }

    return (
        <div className="Tag">
            <Input 
                placeholder="태그" 
                value={name}
                onChange={handleChange}
                suffix={<CloseCircleOutlined />}
                style={{width:"128px"}} 
            />
        </div>
    )
}

export default Tag;