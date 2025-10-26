import { Link } from 'react-router-dom';
import Box from '../../box';
import ActionBtn from '../../../actionbtn/actionbtn';
import './upload-box.css'
function UploadBox(){
    return(
        <Box id="upload-box">
            <h2>Du bist BGT'ler?</h2>
            <div>Teile jetzt dein Projekt mit der Welt!</div>
            <Link to="/login">
                <ActionBtn id="uploadBtn" color="#2cade3">Upload!</ActionBtn>
            </Link>
        </Box>
    )
}

export default UploadBox;