import React from 'react';
import PropTypes from 'prop-types';

const MainLayout = ({children}) => {
	return (
	<div className="flex flex-row h-screen">
		<div className="flex-auto border-l rounded-tl-xl shadow">
			{children}
		</div>		
	</div>
	);
};

MainLayout.propTypes = {
	children: PropTypes.node,
};

export default MainLayout;
