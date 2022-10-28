import React from 'react';

const APP_CONTEXT_LOCAL_STORAGE_NAME = "app-context-local-storage-name";

const AppContext = React.createContext();

const initialState = {};

let localState = {};
if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
	localState = JSON.parse(localStorage.getItem(APP_CONTEXT_LOCAL_STORAGE_NAME));
}

const reducer = (appCtx, newAppCtx) => {
	if (newAppCtx === null) {
		if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
			localStorage.removeItem(APP_CONTEXT_LOCAL_STORAGE_NAME);
		}		
		return initialState;
	}	
	return { ...appCtx, ...newAppCtx };
};

export const useAppContext = () => {
	const context = React.useContext(AppContext);
	if (!context) {
		throw new Error("useAppContext must be used within a AppContextProvider");
	}
	return context;
}

export const AppContextProvider = (props) => {
	const [appCtx, setAppCtx] = React.useReducer(reducer, localState || initialState);

	React.useEffect(() => {
		if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
			localStorage.setItem(APP_CONTEXT_LOCAL_STORAGE_NAME, JSON.stringify(appCtx));
		}		
	}, [appCtx]);

	return (<AppContext.Provider value={[appCtx, setAppCtx]} {...props} />);
};
