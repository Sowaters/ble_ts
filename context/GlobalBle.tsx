import { createContext, useContext, useState,useReducer } from "react";

interface GlobalBleProps {
    children: React.ReactNode;
}
interface GlobalBleStateProps {
    device: any[] | null;
    status: any[] | null;
}
interface GlobalBleActionProps {
    type: string;
    payload: any;
}

const initialState: GlobalBleStateProps = {
    device: [],
    status: [],
};

const reducer = (state: GlobalBleStateProps, action: GlobalBleActionProps): GlobalBleStateProps => {
    switch (action.type) {
        case "SET_DEVICE":
            
            console.log('==>接收到的数据',action.payload);
            // return { ...state, device: action.payload };
        case "SET_STATUS":
            return { ...state, status: action.payload };
        default:
            return state;
    }
};

const GlobalBleContext = createContext<{ state: GlobalBleStateProps; dispatch: React.Dispatch<GlobalBleActionProps> }>({ state: initialState, dispatch: () => { } });

export const useGlobalBle = () => useContext(GlobalBleContext);

export const GlobalBleProvider = ({ children }:GlobalBleProps) => {

    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <GlobalBleContext.Provider value={{state,dispatch}}>
            {children}
        </GlobalBleContext.Provider>
        
    )
}
