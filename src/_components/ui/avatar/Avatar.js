import React from 'react';
import { Image } from 'semantic-ui-react';

const Avatar = ({ imagePath }) => (
	<Image
		src={imagePath ? imagePath : 'https://react.semantic-ui.com/images/wireframe/square-image.png'}
		size="medium"
		circular
	/>
);

export { Avatar };
