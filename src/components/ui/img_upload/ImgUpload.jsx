import React from 'react';
import { Icon } from 'semantic-ui-react';
import './imgupload.less';

const ImgUpload = ({ onChange, src }) => {
	return (
		<label htmlFor="photo-upload" className="custom-file-upload fas">
			<div className="img-wrap img-upload">
				<Icon className="img-upload__icon" name="upload" />
				<img className="upload__img" htmlFor="photo-upload" src={src} />
			</div>
			<input id="photo-upload" type="file" onChange={onChange} />
		</label>
	);
};

export { ImgUpload };
